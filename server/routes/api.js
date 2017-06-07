const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const winston = require('winston')
const mjml = require('../lib/mjml.js')
const MJML = new mjml()
const redis = require('redis')
const couchdb = require('../lib/mci-couchdb.js')
const merge = require('lodash.merge')

dotenv.config()

let router = express.Router()
let jsonParser = bodyParser.json()
const redisClient = redis.createClient()

router.get('/list/:skip?', jsonParser, (req, res) => {
	const skip = req.query && req.query.skip ? req.query.skip : null

	couchdb.listEmails(skip)
	.then(emails => {
		res.send(emails.data)
	}).catch(err => {
		winston.error(err)
		res.sendStatus(500)
	})
})

router.get('/templates', (req, res) => {
	const templateDir = path.resolve(__dirname, '../../mjml-templates')
	fs.readdir(templateDir, (err, files) => {
		if(!err) {
			let fileList = files.filter((file) => {
				return path.extname(file) === '.mjml'
			}).map( (f) => {
				return path.basename(f, '.mjml')
			})
			res.send(fileList)
		}
		else {
			winston.error(err)
			res.send(err)
		}
	})
})

router.post('/compile', jsonParser, (req,res) => {

	const context = JSON.parse(req.body.context)
	const template = context.template

	const parsedMJML = MJML.parseHandlebars(context, template)
	const compiledHTML = MJML.compileToMJML(parsedMJML)

	if(compiledHTML.errors.length < 1) {
		let inlinedHTML = MJML.inlineCSS(compiledHTML.html)
		res.status(200).send(inlinedHTML)
	}
	else {
		console.log(compiledHTML.errors)
		res.status(500).send(compiledHTML.errors[0].message)
	}
})

router.post('/create', jsonParser, (req,res) => {
	const { contents, title } = req.body
	const sessionID = `sess-${req.sessionID}`
	let user

	redisClient.get(sessionID, (err, data) => {
		if (err) {
			winston.error(err)
		} else {
			user = JSON.parse(data)

			couchdb.createEmail({
				contents,
				title,
				author: user.name,
				email: user.email
			}).then((ok) => {
				return couchdb.getEmailByID(ok.data.id)
			}).then(email => {
				return res.send(email.data)
			}).catch(err => {
				winston.error(err)
				return res.sendStatus(500)
			})
		}
	})
})

router.get('/:id', (req, res) => {
	couchdb.getEmailByID(req.params.id).then(email => {
		return res.send(email.data)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

router.put('/:id', jsonParser, (req, res) => {
	const id = req.params.id
	let reqDoc = req.body.doc
	couchdb.putEmail(id, reqDoc)
		.then((success) => {
			if(success) {
				couchdb.getEmailByID(success.data.id)
				.then(successDoc => {
					return res.status(200).send(successDoc.data)
				})
			}
		})
		.catch(err => {
			console.log(err)
			res.status(err.response.status).send(err.message)
			winston.error(err)
		})


})

router.delete('/delete', jsonParser, (req, res) => {
	if (!req.query || !req.query.id) {
		return res.sendStatus(400)
	}

	const ids = typeof req.query.id === 'string' ? [req.query.id] : req.query.id

	couchdb.deleteEmails(ids)
	.then(() => {
		return res.sendStatus(200)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

// TODO: make this work + test it
router.post('/search', jsonParser, (req, res) => {
	couchdb.searchEmails(req.body.searchText)
	.then(emails => {
		return res.send(emails)
	}).catch(err => {
		winston.error(err)
		return res.status(500)
	})
})

router.post('/copy', jsonParser, (req, res) => {
	const id = req.body.id

	// guard clause: prevent non-string ID
	if (!id || typeof id !== 'string') {
		return res.status(400).json({message: 'Did not pass valid email to duplicate'})
	}

	couchdb.duplicateEmail(id)
	.then(ok => {
		return couchdb.getEmailByID(ok.data.id)
	}).then((email) => {
		return res.send(email.data)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

module.exports = router
