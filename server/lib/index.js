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
const axios = require('axios')
const paths = require('../../config/paths')
const bodyParser = require('body-parser')
const winston = require('winston')

require('winston-loggly-bulk')

dotenv.config()

const jsonParser = bodyParser.json()
const { COUCHDB_URL, NODE_ENV, SESSION_SECRET } = process.env

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

// express and passportjs config
// init static route before expressSession
// init expressSession before passport 
let app = express()
app.use('/public', gzipStatic(paths.build))

app.use(expressSession({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	session: true,
	cookie: {
		httpOnly: true,
		secure: NODE_ENV === 'production' ? true : false,
		maxAge: 1000 * 60 * 5 // 5 min
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

//sendfile for any routes that don't match
app.get('*', (req, res) => {
	res.sendFile('index.html', {
		root: process.env.PWD + '/public'
	}, (err) => {
		if(err) {
			console.log('err sendFile ', err)
		}
	})
})

// on startup, should check to see if database connection is good.
// if so, start db
axios.get(COUCHDB_URL)
	.then((response) => {
		if(response && response.data) {
			app.listen(3000, () => {
				console.log('Express listening on port 3000!')
			})
			return response
		}
		else {
			throw new Error('Could not connect to couchDB. Please check your config.')
		}
	})
	.catch(err => {
		console.log(err)
		throw err
	})

