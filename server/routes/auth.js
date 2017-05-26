const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const axios = require('axios')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const winston = require('winston')

dotenv.config()

const AUTH_URL = process.env.AUTH_URL
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
	}).catch(err => done(null, false, err))
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

	app.get('/api/auth/logout', (req, res) => {
		req.logout()
		res.redirect('/login')
	})
}

passportjs.verifySession = (req, res, next) => {
	// skip /login routes
	if (req.originalUrl.includes('/login')) {
		next()
	} else if (req.isAuthenticated && req.isAuthenticated()) {
		next()
	// redirect on browser routes; send Forbidden on api routes
	} else {
		req.originalUrl.includes('/api') ? res.sendStatus(403) : res.redirect('/login')
	}
}

module.exports = passportjs
