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
});

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
		id: req.body.id,
		template: req.body.template
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