const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const fs = require('fs')
const gzipStatic = require('connect-gzip-static')
const session = require('express-session')
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
const { COUCHDB_URL, NODE_ENV } = process.env

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

let app = express()

app.use(session({
	secret: 'dumbsecret',
	resave: false, 
	saveUninitialized: false
}))
passportjs.init(app)

app.use('/public', gzipStatic(paths.build))
app.use('/api/email', API)
app.use('/api/s3', S3)
app.use('/api/meta', meta)

app.post('/api/log', jsonParser, (req, res) => {
	const { data, level } = req.body.data
	winston.log(level, data)
	res.sendStatus(200)
})

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

