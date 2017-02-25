import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import session from 'express-session'
import { passportjs } from '../routes/auth.js'
import { API } from '../routes/api.js'
import { S3 } from '../routes/s3.js'
import { auth } from '../routes/auth.js'
import axios from 'axios'

dotenv.config()

const { COUCHDB_URL, EMAIL_DB, IMAGE_DB, USER_DB } = process.env

let app = express()

app.use(session({
	secret: 'dumbsecret',
	resave: false, 
	saveUninitialized: false
}))
passportjs.init(app)
app.use('/api/email', API)
app.use('/api/s3', S3)
// app.use('/api/auth/', auth)

app.get('/editor/*', (req, res) => {
	res.redirect('/')
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../../index.html'), {}, (err) => {
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

