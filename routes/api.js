import fs from 'fs'
import path from 'path'
import express from 'express'
import db from '../models/index.js'
import bodyParser from 'body-parser'
import Utils from '../utils.js'

let router = express.Router()
let jsonParser = bodyParser.json()

router.get('/listEmails', jsonParser, (req, res) => {
	db.email.findAll({
		order: '"updatedAt"DESC',
		limit: 20
	}).then((results) => {
		res.send(results)
	})
})

router.get('/templates', (req, res) => {
	const templateDir = path.resolve(__dirname, '../templates')
	fs.readdir(templateDir, (err, files) => {
		if(err) {
			throw new Exception('error reading templates: ', err)
		}
		else {
			let fileList = files.map( (f, i) => {
				return path.basename(f, '.hbs')
			})
			res.send(fileList)
		}
	})
})

router.post('/compileTemplate', jsonParser, (req,res) => {
	Utils.getCompiledHandlebarsTemplate(req.body, (compiledTemplate) => {
		const inlinedTemplate = Utils.inlineEmailCSS(compiledTemplate)
		res.send(inlinedTemplate)
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
	let { content, title } = req.body;
	db.email.create({
		content: content,
		title: title
	}).then((results) => {
		let dataValues = results.get({ plain: true })
		res.send(dataValues)
	})
})

router.post('/updateEmail', jsonParser, (req, res) => {
	let wat = Object.assign({}, req.body)
	console.log(wat)
	db.email.upsert(
		Object.assign({}, req.body)
		// content: req.body.content,
		// title: req.body.title,
		// id: req.body.emailID,
		// template: req.body.template
	).then(() => {
		res.sendStatus(200)
	})
})

router.post('/deleteEmail', jsonParser, (req, res) => {
	let emailsToDelete = req.body.selectedEmails
	db.email.destroy({
		where: { id: emailsToDelete }
	})
	.then((instance) => {
		//returns number of affected rows
		res.send('deleted', instance, 'emails')
	})
})

router.post('/copyEmail', jsonParser, (req, res) => {
	const id = req.body.id[0]
	db.email.findById(id)
		.then((instance) => {
			console.log(instance.get({plain:true}))
			return instance.get({plain: true})
		})
		.then((newEmail)=> {
			db.email.create({
				content: newEmail.content,
				template: newEmail.template,
				title: newEmail.title,
			})
			.then(()=> {
				res.sendStatus(200)
			})
		})
	
})

export { router as API }