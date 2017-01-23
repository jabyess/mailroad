import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import express from 'express'
import db from '../models/index.js'
import bodyParser from 'body-parser'
import Utils from '../lib/utils.js'
import multer from 'multer'
import AWS from 'aws-sdk/clients/s3'

dotenv.config()

let upload = multer()
let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env

const s3Config = {
	region: env.AWS_REGION,
	accessKeyId: env.AWS_ACCESS_KEY_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
}

const s3Params = {
	Bucket: env.AWS_BUCKET
}

let S3 = new AWS(s3Config)

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
	db.email.create({ content, title }).then((results) => {
		let dataValues = results.get({ plain: true })
		res.send(dataValues)
	})
})

router.post('/updateEmail', jsonParser, (req, res) => {
	db.email.upsert(
		Object.assign({}, req.body)
	).then(() => {
		res.sendStatus(200)
	}).catch((err)=>{
		console.log(err)
		res.status(500).send(err)
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

// AWS_BUCKET + .s3.amazonaws.com/ + data.key
router.get('/s3/list', (req, res) => {
	const approvedImageExtensions = ['.png','.jpg','.gif','.tiff','.jpeg','.bmp']
	S3.listObjects(s3Params, (err, data) => {
		if(err) {
			console.log(err, err.stack)
			res.send(err)
		}
		else {
			let imagesArray = data.Contents.filter((image, index) => {
				if(approvedImageExtensions.some((extension) => {
					return extension === path.extname(image.Key)
				})) { 
					return image
				 }
			}).map((image) => {
				return {
					url: '//' + env.AWS_BUCKET + '.s3.amazonaws.com/' + image.Key,
					lastModified: image.LastModified,
					size: image.Size,
					fileName: image.Key
				}
			})
			res.send(imagesArray)
		}
	})
})

router.post('/s3/delete', jsonParser, (req, res) =>{
	let tempParams = {
		Bucket: s3Params.Bucket,
		Key: req.body.key
	}
	S3.deleteObject(tempParams, (err, data) => {
		if(err) {
			console.log(err)
		}
		else {
			console.log(data)
			res.sendStatus(200)
		}

	})
})

/* 
	example req.file object
{ fieldname: 'file',
  originalname: 'file7561294493011.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads/', //only set if you initialize uploads = multer({dest: 'uploads/'})
  filename: '62bec39493e5729f980b562c2a4bdee6',
  path: 'uploads/62bec39493e5729f980b562c2a4bdee6',
  size: 197202 }
*/
router.post('/s3/create', upload.single('file'), (req, res) => {
	let createParams = {
		Key: req.file.originalname,
		Bucket: s3Params.Bucket,
		ContentType: req.file.mimetype,
		ContentLength: req.file.size,
		Body: req.file.buffer
	}
	console.log(req.file)
	console.log(req.body)
	S3.putObject(createParams, (err, data) => {
		if(err) {
			console.log(err)
			res.sendStatus(500)
		}
		else {
			console.log(data)
			res.sendStatus(200)
		}
	})

	// console.log('request')
	// res.sendStatus(200)
})

export { router as API }