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
	db.email.upsert({
		emailContent: req.body.content,
		title: req.body.title,
		id: req.body.id
	}).then(() => {
		res.send(res.body)
	})
})

router.delete('/deleteEmail/:id', (req, res) => {
	db.email.findById(req.params.id)
	.then((instance) => {
		return instance.destroy()
	}).then((results) => {
		res.send(res.body)
	})
})

export { router as API }