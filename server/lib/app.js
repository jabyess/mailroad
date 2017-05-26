const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const fs = require('fs')
const gzipStatic = require('connect-gzip-static')
const expressSession = require('express-session')
const passportjs = require('../routes/auth.js')
const API = require('../routes/api.js')
const S3 = require('../routes/s3.js')
const meta = require('../routes/meta.js')
const paths = require('../../config/paths')
const bodyParser = require('body-parser')
const winston = require('winston')

require('winston-loggly-bulk')

dotenv.config()

const jsonParser = bodyParser.json()
const { NODE_ENV, SESSION_SECRET } = process.env

//configure logging environment (loggly or local)
if(NODE_ENV === 'production') {
	winston.add(winston.transports.Loggly, {
		token: process.env.WINSTON_API_TOKEN,
		subdomain: process.env.WINSTON_SUBDOMAIN,
		tags: [ 'mailroad' ],
		json: true
	})
}

else {
	const logDir = path.resolve(process.cwd(), 'logs')
	if(fs.statSync(logDir)) {
		winston.add(winston.transports.File, {
			filename: path.join(logDir, 'mclog.log'),
			json: false
		})
	}
}

const app = express()

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

// protect api route
app.use('/api', passportjs.verifySession)

// this is the /api/auth route
// pass in the express instance
passportjs.init(app)

// api routes config
app.use('/api/email', API)
app.use('/api/s3', S3)
app.use('/api/meta', meta)
app.post('/api/log', jsonParser, (req, res) => {
	const { data, level } = req.body.data
	winston.log(level, data)
	res.sendStatus(200)
})

//healthcheck for AWS instance monitoring
app.get('/__health-check__', (req, res) => {
	res.set({
		'Content-Type': 'text/plain',
		'Connection': 'close'
	}).status(200).send('OK').end()
	return null
})

//sendfile for any routes that don't match
app.get('*', passportjs.verifySession, (req, res) => {
	res.sendFile('index.html', {
		root: process.env.PWD + '/public'
	}, (err) => {
		if(err) {
			console.log('err sendFile ', err)
		}
	})
})

module.exports = app
