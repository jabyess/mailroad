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
		let dataValues = results.get({ plain: true })
		res.send(dataValues)
	})
})

router.post('/createNewEmail', jsonParser, (req,res) => {
	let emailContent = []
	let emailTitle = 'test post new email'

	db.email.create({
		emailContent: emailContent,
		title: emailTitle
	}).then((results) => {
		let dataValues = results.get({ plain: true })
		res.send(dataValues)
	})
})

router.post('/updateEmail', jsonParser, (req, res) => {
	let emailContent = req.body.content
	let emailTitle = req.body.title
	
	db.email.upsert({
		emailContent: emailContent,
		title: emailTitle,
		id: req.body.id
	}).then(() => {
		res.send(res.body);
	})
})

export { router as API }