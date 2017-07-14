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
const joi = require('../lib/validation.js')

dotenv.config()

let router = express.Router()
let jsonParser = bodyParser.json()
const redisClient = redis.createClient()

router.get('/list/:skip?', jsonParser, joi.validate(joi.schema.emails.list), (req, res) => {
	const skip = req.joi.skip || null

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

router.post('/compile', jsonParser, joi.validate(joi.schema.emails.compile), (req,res) => {

	const { context } = req.joi
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

router.post('/create', jsonParser, joi.validate(joi.schema.emails.create), (req,res) => {
	const { contents, title } = req.joi
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

router.get('/:id', joi.validate(joi.schema.emails.getOne), (req, res) => {
	couchdb.getEmailByID(req.joi.id).then(email => {
		return res.send(email.data)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

router.put('/:id', jsonParser, joi.validate(joi.schema.emails.put), (req, res) => {
	couchdb.putEmail(req.joi.id, req.joi.doc)
	.then((success) => {
		return couchdb.getEmailByID(success.data.id)
	}).then((doc) => {
		return res.status(200).send(doc.data)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

router.delete('/delete', jsonParser, joi.validate(joi.schema.emails.delete), (req, res) => {
	couchdb.deleteEmails(req.joi.id)
	.then(() => {
		return res.sendStatus(200)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

// TODO: make this work + test it
router.post('/search', jsonParser, joi.validate(joi.schema.emails.search), (req, res) => {
	couchdb.searchEmails(req.joi.searchText)
	.then(emails => {
		return res.send(emails)
	}).catch(err => {
		winston.error(err)
		return res.status(500)
	})
})

router.post('/copy', jsonParser, joi.validate(joi.schema.emails.duplicate), (req, res) => {
	couchdb.duplicateEmail(req.joi.id)
	.then(ok => {
		return couchdb.getEmailByID(ok.data.id)
	}).then((email) => {
		return res.send(email.data)
	}).catch(err => {
		winston.error(err)
		return res.sendStatus(500)
	})
})

router.post('/send', jsonParser, joi.validate(joi.schema.emails.send), (req, res) => {
	couchdb.getEmailByID(req.joi.id)
		.then(emailRes => {
			// console.log(emailRes)
			return emailRes.data
		})
		.then(emailData => {
			console.log(emailData)
			const { contents, template } = emailData
			const compiledHTML = MJML.parseHandlebars(contents, template)
			const compiledMJML = MJML.compileToMJML(compiledHTML)

			res.send(compiledMJML)
		})
		.catch(err => {
			winston.error(err)
		})
})

module.exports = router
