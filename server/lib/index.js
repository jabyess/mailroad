import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import hbs from 'express-handlebars'
import { API } from '../routes/api.js'
import axios from 'axios'
import fs from 'fs'

dotenv.config()
const { COUCHDB_URL, EMAIL_DB, IMAGE_DB, USER_DB } = process.env
const EMAILDB_URL = COUCHDB_URL + EMAIL_DB
const UUID_URL = COUCHDB_URL + '_uuids'

let app = express()

app.engine('handlebars', hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// app.use('/scripts', express.static(path.join(__dirname, 'dist')))
app.use('/api', API)


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

