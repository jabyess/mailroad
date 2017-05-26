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

passportjs.init = (app) => {

	passport.use(new LocalStrategy({
		passReqToCallback: true
	},
	(req, username, password, done) => {
		return axios.get(AUTH_URL, {
			auth: {
				username: username,
				password: password
			}
		})
		.then(authenticated => {
			const sessionID = `sess-${req.session.id}`

			let redisObj = {
				name: authenticated.data.user.cb,
				email: authenticated.data.user.uid,
				uuid: authenticated.data.user.id,
				sessionID: sessionID
			}

			let redisString = JSON.stringify(redisObj)

			// 86400 = seconds = 1 day
			redisClient.setex(sessionID, 86400, redisString, (err) => {
				if(!err) {
					return done(null, redisString)
				}
				else {
					winston.error(err)
					done(err)
					return false
				}
			})
		},
		failed => {
			// 401 if user valid, password invalid
			// 400 if neither is valid
			// currently no ways to pass statuscode back to client
			// unless we pass done(null, { failed.response.status })
			// this breaks passportjs strategy convention though.
			if(failed.response.status) {
				const failObj = {
					status: failed.response.status,
					message: 'Error logging in',
					statusText: failed.response.statusText,
					responseUrl: failed.response.request._currentUrl
				}
				winston.warn(failObj)
			}
			return done(null, false)
		})
		.catch((err) => {
			winston.error(err)
			return done(err)
		})
	}))

	app.use(passport.initialize())
	app.use(passport.session())

	passport.serializeUser((userObj, done) => {
		let parsedObj = JSON.parse(userObj)
		done(null, parsedObj.sessionID)
	})

	passport.deserializeUser((sessionID, done) => {
		redisClient.get(sessionID, (err, userObj) => {
			if(!err) {
				done(null, userObj)
			}
			else {
				winston.error(err)
			}
		})
	})

	app.post('/api/auth/login', jsonParser, passport.authenticate('local', {
		session: true,
		successRedirect: '/',
		// no failure redirect
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
				res.sendStatus(403)
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
		res.redirect('/login')
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
