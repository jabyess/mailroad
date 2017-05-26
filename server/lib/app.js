const dotenv = require('dotenv')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const gzipStatic = require('connect-gzip-static')
const expressSession = require('express-session')
const paths = require('../../config/paths')
const jsonParser = require('body-parser').json()
const passport = require('../routes/auth.js')
const winston = require('winston')

require('winston-loggly-bulk')
dotenv.config()

const { NODE_ENV, SESSION_SECRET } = process.env





// logging


if(NODE_ENV === 'production') {
	winston.add(winston.transports.Loggly, {
		token: process.env.WINSTON_API_TOKEN,
		subdomain: process.env.WINSTON_SUBDOMAIN,
		tags: [ 'mailroad' ],
		json: true
	})
} else {
	const logDir = path.resolve(process.cwd(), 'logs')
	if(fs.statSync(logDir)) {
		winston.add(winston.transports.File, {
			filename: path.join(logDir, 'mclog.log'),
			json: false
		})
	}
}


// app config (sessions, headers, and authentication)


app.use('/public', gzipStatic(paths.build))

app.use(expressSession({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	session: true,
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60 * 24 // 1 day
	}
}))

app.use('/api', passport.verifySession)
passport.init(app)



// routes (api, logging, and catchalls)



app.use('/', require('../routes'))

app.post('/api/log', jsonParser, (req, res) => {
	const { data, level } = req.body.data
	winston.log(level, data)
	res.sendStatus(200)
})

app.get('/__health-check__', (req, res) => {
	res.set({
		'Content-Type': 'text/plain',
		'Connection': 'close'
	}).status(200).send('OK').end()
	return null
})

app.get('*', passport.verifySession, (req, res) => {
	res.sendFile('index.html', {
		root: process.env.PWD + '/public'
	}, (err) => {
		if(err) {
			console.log('err sendFile ', err)
		}
	})
})



module.exports = app
