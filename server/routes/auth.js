import dotenv from 'dotenv'
import Promise from 'bluebird'
import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import passport from 'passport'
let LocalStrategy = require('passport-local').Strategy

dotenv.config()

const AUTH_URL = process.env.AUTH_URL

let jsonParser = bodyParser.json()
let router = express.Router()
let passportjs = {}

passportjs.init = (app) => {
	passport.use(new LocalStrategy((username, password, done) => {
		console.log(username, password)
		axios.get(AUTH_URL, {
			auth: {
				username: username,
				password: password
			}
		}).then(authenticated => {
			console.log('success', authenticated)
			return done(null, authenticated.user)
		})
		.catch((err) => {
			console.log('auth fail', err)
			return done(err)
		})
	}))

	app.use(passport.initialize())
	app.use(passport.session())

	passport.serializeUser((user, done) => {
		done(null, user)
	}) 

	passport.deserializeUser((user, done) => {
		done(null, user)
	})

	app.post('/api/auth/login', jsonParser, passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		session: true,
	}), (req, res) => {
		console.log(req)
		// res.redirect('/')
		res.send('k')

	})
}
//auth.morningconsultintelligence.com


router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	session: true,
}), (req, res) => {
	console.log(req)
	// res.redirect('/')
	res.send('k')

})


export { router as auth }
export { passportjs }