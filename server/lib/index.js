const dotenv = require('dotenv')
const path = require('path')
const express = require('express')
const session = require('express-session')
const passportjs = require('../routes/auth.js')
const API = require('../routes/api.js')
const S3 = require('../routes/s3.js')
const meta = require('../routes/meta.js')
const axios = require('axios')


dotenv.config()

const { COUCHDB_URL, EMAIL_DB, IMAGE_DB, USER_DB } = process.env

let app = express()

app.use(session({
	secret: 'dumbsecret',
	resave: false, 
	saveUninitialized: false
}))
passportjs.init(app)

app.use('/static', ((req, res) => {
	console.log('got static req')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	})
	console.log('got static res', res._headers)
}))

// app.use('/static', ((req, res, next) => {
// 	console.log('got static req')
// 	res.set({
// 		'Access-Control-Allow-Origin': '*',
// 		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
// 	})
// 	console.log('got static res', res._headers)
// 	// res.set()
// 	next()
// }), express.static(path.join(__dirname, '../'), {
// 	index: false,
// }))

app.use('/api/email', API)
app.use('/api/s3', S3)
app.use('/api/meta', meta)
app.get('/editor/*', (req, res) => {
	res.redirect('/')
})

app.get('/', (req, res) => {
	console.log('caught req on /', req.headers.host, req.params)
	res.sendFile('index.html', {
		root: __dirname
	}, (err) => {
		if(err) {
			console.log('err sendFile ', err)
		}
	})
})

// on startup, should check to see if database connection is good.
// if so, make sure all couchdb-views are in the system by making http requests against them
// if so, start db
// if not, create them then start db
axios.get(COUCHDB_URL)
	.then((response) => {
		if(response && response.data) {
			app.listen(3000, () => {
				console.log('Express listening on port 3000!')
			})
		}
		else {
			throw new Error('Could not connect to couchDB. Please check your config.')
		}
	})
	.catch((err) => {
		console.log(err)
		throw err
	})

