import express from 'express'
import db from '../models/index.js'
import fs from 'fs'
import util from 'util'
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
	console.log(req.body)
	let emailContent = req.body[0].emailContent
	let emailTitle = req.body[0].title
	
	db.email.create({
		emailContent: emailContent,
		title: emailTitle
	}).then(() => {
		console.log('inserted: ' + emailContent)
		res.send(res.body);
	})
})

export { router as API }