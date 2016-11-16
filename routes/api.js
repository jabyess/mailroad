import express from 'express'
import db from '../models/index.js'
import bodyParser from 'body-parser'

let router = express.Router()
let jsonParser = bodyParser.json()

router.get('/listEmails', jsonParser, (req, res) => {
	db.email.findAll({
		order: '"updatedAt"DESC',
		limit: 20
	}).then((results) => {
		res.send(results);
	})
})

router.get('/getEmail/:id', (req, res) => {
	let id = req.params.id
	db.email.findById(id).then((results) => {
		//extract only the content we want from db
		//sequelize returns a lot of extraneous data otherwise
		//so we use .get and plain:true
		res.send(results.get({
			plain: true
		}))
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