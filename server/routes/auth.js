const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const axios = require('axios')
const passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
const redis = require('redis')


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
				password: password,
			}
		}).then(authenticated => {
			const uid = authenticated.data.user.id
			const sessionToken = req.body.sessionToken

			redisClient.setex(sessionToken, 86400, uid, (err, success) => {
				if(err) {
					// TODO: system log error
					return false
				}
				if(!err) {
					return done(null, sessionToken)
				}
				else {
					console.log(err)
				}
			})
		},
		failed => {
			// 401 if user valid, password invalid
			// 400 if neither is valid
			// currently no ways to pass value back to client
			// unless we pass done(null, { failed.data.response })
			// this breaks passportjs strategy convention though.
			console.log('failed', failed) 
			return done(null, false)
		})
		.catch((err) => {
			console.log('err', err)
			console.log(err.response.data)
			return done(err)
		})
	}))

	app.use(passport.initialize())
	app.use(passport.session())

	passport.serializeUser((token, done) => {
		done(null, token)
	})

	passport.deserializeUser((token, done) => {
		redisClient.get(token, (err, uid) => {
			if(!err) {
				done(null, uid)
			}
		})
	})

	app.post('/api/auth/login', jsonParser, passport.authenticate('local', {
		session: true
	}), (req, res) => {
		//if passport.authenticate validates, send success status
		res.sendStatus(200)
	})

	app.post('/api/auth/redirect', jsonParser, (req, res) => {
		const key = req.body.key
		console.log(req.body)
		console.log(key)
		redisClient.set('key',key, redis.print)
		res.send('set key')
	})

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

	app.get('/api/auth/verify/:uid', (req, res) => {
		const uid = req.params.uid
		redisClient.get(uid, (err, data) => {
			if(err) {
				//TODO: system log error
				console.log(err)
				res.sendStatus(500)
			}
			else if(!data) {
				console.log('nodata')
				res.sendStatus(404)
			}
			else if(data) {
				console.log(data)
				res.sendStatus(200)
			}
		})
	})

}

module.exports = passportjs