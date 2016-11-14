import express from 'express'
import db from '../models/index.js'
import bodyParser from 'body-parser'

let router = express.Router()
let jsonParser = bodyParser.json()

router.get('/listEmails', jsonParser, (req, res) => {
	db.email.findAll({
		order: '"updatedAt"DESC',
		limit: 20
	}).then((results, wat) => {
		res.send(results);
	})
})

router.post('/createEmail', jsonParser, (req, res) => {
	let emailContent = req.body.content
	let emailTitle = req.body.title
	
	db.email.create({
		emailContent: emailContent,
		title: emailTitle
	}).then(() => {
		res.send(res.body);
	})
})

export { router as API }