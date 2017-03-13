const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

dotenv.config()

let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env

const COUCHDB_URL = env.COUCHDB_URL
const META_DB = COUCHDB_URL + env.META_DB + '/'

router.post('/save', jsonParser, (req, res) => {
	const categories = req.body.categories

	axios.get(META_DB + 'categories')
		.then(doc => {
			const newDoc = Object.assign({}, doc.data)
			newDoc.categories = categories
			return newDoc
		})
		.then(newDoc => {
			axios.put(META_DB + newDoc._id, {
				_id: newDoc._id,
				_rev: newDoc._rev,
				categories: newDoc.categories
			})
				.then(posted => {
					if(posted.data.ok === true) {
						return res.sendStatus(200)
					}
				})
				.catch(err => {
					return err
				})
		})
		.catch(err => {
			//TODO: log error
			res.status(500).send(err)
		})
})

router.get('/loadConfig', (req, res) => {
	const config = req.query.config
	const url = META_DB + config

	axios.get(url)
		.then(response => {
			res.send(response.data)
		},
		fail => {
			console.log('fail', fail)
		}
		)
		.catch(err => {
			res.status(500).send(err)
		})
})


module.exports = router
