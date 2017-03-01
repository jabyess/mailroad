const dotenv = require('dotenv')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const axios = require('axios')
const passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
const redis = require('redis')


dotenv.config()

const AUTH_URL = process.env.AUTH_URL
const AUTH_VERIFY_URL = process.env.AUTH_VERIFY_URL

const redisClient = redis.createClient()
let jsonParser = bodyParser.json()
// let router = express.Router()

let passportjs = {}

passportjs.init = (app) => {

	passport.use(new LocalStrategy({
		passReqToCallback: true
	},(req, username, password, done) => {
		console.log(username, password)
		return axios.get(AUTH_URL, {
			auth: {
				username: username,
				password: password,
			}
		}).then(authenticated => {
			const uid = authenticated.data.user.id
			const sessionToken = req.body.sessionToken

			redisClient.set(sessionToken, uid, () => {
				return done(null, sessionToken)
			})
			// const authObj = {
			// 	uid, sessionToken
			// console.log('success', sessionToken)
			// return done(null, sessionToken)
		}, failed => {
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
		console.log('serializing', token)
		done(null, token)
	})

	passport.deserializeUser((token, done) => {
		console.log('deserializing', token)
		redisClient.get(token, (err, uuid) => {
			if(!err) {
				console.log('got it', uuid)
				done(null, uuid)
			}
		})
	})

	app.post('/api/auth/login', jsonParser, passport.authenticate('local', {
		session: true
	}), (req, res) => {
		console.log(req.body)
		res.send({route: '/'})
	})

	app.post('/api/auth/redirect', jsonParser, (req, res) => {
		const key = req.body.key
		console.log(req.body)
		console.log(key)
		redisClient.set('key',key, redis.print)
		res.send('set key')
		
	})

}

// b6749cddd436d59c1c875ed8


// router.post('/redirect', (req, res) => {
// 	console.log('hit redirect')
// 	res.status(200).send({route: '/'})
// })




// router.post('/login', bodyParser, (req, res) => {
// 	console.log(req)
// 	const { username, password } = req.body.auth

// 	axios.get(AUTH_URL, {
// 		auth: {
// 			username: username,
// 			password: password,
// 		}
// 	}).then(authenticated => {
// 		const user = authenticated.data.user
// 		console.log('success', user)
// 		return done(null, user)
// 	}, failed => {
// 		console.log('failed', failed)
// 		return done(null, false)
// 	})
// 	.catch((err) => {
// 		console.log('err', err)
// 		console.log(err.response.data)
// 		return done(err)
// 	})
// 	res.redirect('/')
// 	res.send()
// })


// export { router as auth }
export { passportjs }