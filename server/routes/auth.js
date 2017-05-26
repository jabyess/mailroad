const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const axios = require('axios')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const redis = require('redis')
const winston = require('winston')

dotenv.config()

const AUTH_URL = process.env.AUTH_URL
const redisClient = redis.createClient()
const jsonParser = bodyParser.json()
const passportjs = {}

const fetchUser = (username, password) => {
	return axios.get(AUTH_URL, {
		auth: {
			username: username,
			password: password
		}
	})
}

const authenticate = (username, password, done) => {
	return fetchUser(username, password).then((userObj) => {
		if (!userObj) {
			return done(null, false, { message: 'Invalid username-password combination.' })
		} else {
			return done(null, userObj.data.user)
		}
	}).catch(done)
}





passportjs.init = (app) => {
	passport.use('local', new LocalStrategy(authenticate))
	app.use(passport.initialize())
	app.use(passport.session())

	passport.serializeUser((user, done) => {
		if (!user || !user.id) {
			return done(Error('Invalid user object for serialization'))
		}

		// the object stored in redis (key = session_id, val = obj)
		done(null, {
			name: user.cb,
			email: user.uid,
			id: user.id
		})
	})

	passport.deserializeUser((user, done) => {
		if (!user || !user.id) {
			const err = 'Invalid user for deserialization'
			winston.error(err)
			return done(Error(err))
		}

		return done(null, user)
	})

	app.post('/api/auth/login', jsonParser, passport.authenticate('local', {
		session: true,
		successRedirect: '/'
	}))

	app.delete('/api/auth/:uid', (req, res) => {
		const uid = req.params.uid
		redisClient.del(uid, (err, deletedRecords) => {
			if(!err && deletedRecords > 0) {
				res.sendStatus(200)
			}
			else if(!err && deletedRecords < 1) {
				res.sendStatus(404)
			}
			else {
				// TODO: system log error
				console.log(err)
				res.status(500).send(err)
			}
		})
	})

	app.get('/api/auth/logout', (req, res) => {
		const sessionID = `sess-${req.session.id}`
		redisClient.del(sessionID, (err) => {
			if(!err) {
				req.logout()
				res.redirect('/login')
			}
			else {
				winston.error(err)
				req.logout()
				res.status(500).send(err)
			}
		})
	})

	app.get('/api/auth/verify/:uid', (req, res) => {
		const uid = req.params.uid
		redisClient.get(uid, (err, data) => {
			if(err) {
				winston.error(err)
				res.sendStatus(500)
			}
			else if(!data) {
				res.sendStatus(404)
			}
			else if(data) {
				res.sendStatus(200)
			}
		})
	})
}

passportjs.verifySession = (req, res, next) => {
	let sess = req.session && req.session.passport ? req.session.passport.user : null

	if(req.originalUrl.includes('/login')) {
		next()
	}

	else if(!sess) {
		req.originalUrl.includes('/api') ? res.sendStatus(403) : res.redirect('/login')
	}

	else {
		redisClient.ttl(sess, err => {
			if(!err) {
				next()
			}
			else {
				winston.error(err)
				res.status(500).send(err)
			}
		})
	}

}

module.exports = passportjs
