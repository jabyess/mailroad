import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import Utils from '../lib/utils.js'
import Promise from 'bluebird'
import axios from 'axios'

const mjml = require('../lib/mjml.js')

dotenv.config()

let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env

const COUCH_URL = env.COUCHDB_URL // http://localhost:5984/
const COUCH_UUID = COUCH_URL + '_uuids' // http://localhost:5984/uuids
const COUCH_EMAILS = COUCH_URL + env.EMAIL_DB + '/' // http://localhost:5984/emails/
const COUCH_EMAILS_FIND = COUCH_EMAILS + '_find' // http://localhost:5984/emails/_find

router.get('/list/:skip?', jsonParser, (req, res) => {
	const designUrl = COUCH_EMAILS + '_design/EmailsByUpdatedDate/_view/EmailsByUpdatedDate'
	const skip = req.query && req.query.skip ? req.query.skip : null
	axios.get(designUrl, {
		params: {
			limit: 10,
			descending: true,
			skip: skip
		}
	})
	.then((emails) => {
		let data = emails.data
		res.send(data)
	}).catch((err) => {
		console.log(err)
		throw err
	})
	
})

router.get('/templates', (req, res) => {
	const templateDir = path.resolve(__dirname, '../mjml-templates')
	fs.readdir(templateDir, (err, files) => {
		if(err) {
			throw Error('error reading templates: ', err)
		}
		else {
			let fileList = files.map( (f) => {
				return path.basename(f, '.mjml')
			})
			res.send(fileList)
		}
	})
})

router.post('/compileTemplate', jsonParser, (req,res) => {
	
	const context = JSON.parse(req.body.context)
	const template = context.template

	mjml.parseHandlebars(context, template, (result) => {
		let compiledHTML = mjml.compileToMJML(result)
		if(compiledHTML.errors.length < 1) {
			let inlinedHTML = mjml.inlineCSS(compiledHTML.html)
			console.log(inlinedHTML)
		}
	})

	res.status(200).send('not ready yet')
})

router.post('/create', jsonParser, (req,res) => {
	const { content, title } = req.body
	const createdAt = Utils.getCurrentTimestampUTC()
	const updatedAt = Utils.getCurrentTimestampUTC()
	
	axios.get(COUCH_UUID)
		.then((response) => {
			let uuid = response.data.uuids[0]
			return uuid
		})
		.then((uuid) => {
			let url = COUCH_EMAILS + uuid
			return axios.put(url, {
				content,
				title,
				createdAt,
				updatedAt
			})
			.then((putResponse) => {
				let url = COUCH_EMAILS + putResponse.data.id
				return axios.get(url)
					.then((getResponse) => {
						res.send(getResponse.data)
						return getResponse.data
					})
			}).catch((rejectError) => {
				res.send(rejectError)
				return rejectError
			})
		})
		.catch((err) => {
			console.log('---error in /email/create---')
			console.log(err)
		})
	
})

router.get('/:id', (req, res) => {
	let url = COUCH_EMAILS + req.params.id
	axios.get(url)
		.then((emailData) => {
			res.send(emailData.data)
		})
		.catch((err) => {
			console.log(err)
		})
})

router.delete('/delete', jsonParser, (req, res) => {
	console.log(req.query)
	if(req.query && req.query.id) {
		const ids = req.query.id

		console.log('ids:', ids)

		let idsToDelete = ids.map((_id) => {
			return axios.get(`${COUCH_EMAILS}${_id}`).then((result) => {
				let { _rev } = result.data
				return { _id, _rev }
			})
			.catch((error) => {
				console.log(error)
			})
		})

		Promise.all(idsToDelete).then((deleteObject) => {
			if(deleteObject && deleteObject.length > 1) {
				let url = COUCH_EMAILS + '_bulk_docs'

				const deleteDocs = deleteObject.map((obj) => {
					obj._deleted = true
					return obj
				})

				axios.post(url, {
					docs: deleteDocs
				})
				.then(() => {
					res.sendStatus(200)
				}, failed => {
					res.status(500).send(failed)
				})
				.catch(err => {
					res.status(500).send(err)
				})
			}

			if(deleteObject && deleteObject.length === 1) {
				const { _id, _rev } = deleteObject[0]
				const url = COUCH_EMAILS + _id

				axios.delete(url, {
					params: {
						rev: _rev
					}
				})
				.then(deleted => {
					if(deleted.status === 200) {
						res.sendStatus(200)
					}
				})
				.catch(err => {
					// TODO: Log error
					console.log('error happened in delete', err)
					res.status(500).send(err)
				})

			}
		})
	}
})

router.post('/search', jsonParser, (req, res) => {
	let searchText = req.body.searchText
	console.log('hit search', searchText)
	axios.post(COUCH_EMAILS_FIND, {
		selector: {
			title: searchText
		}
	})
	.then((response) => {
		console.log(response)
		res.send(response)
	})
})

// router.post('/copyEmail', jsonParser, (req, res) => {
// 	const id = req.body.id[0]
// })

export { router as API }