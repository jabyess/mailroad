import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import Utils from '../lib/utils.js'
import multer from 'multer'
import AWS from 'aws-sdk/clients/s3'
import axios from 'axios'

dotenv.config()

let upload = multer()
let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env

const COUCH_URL = 'http://127.0.0.1:5984/'
const COUCH_DB = 'emailbuilder/'
const COUCH_UUID = COUCH_URL + '_uuids'
const COUCH_FULL = COUCH_URL + COUCH_DB

axios.defaults.baseURL = COUCH_FULL

const s3Config = {
	region: env.AWS_REGION,
	accessKeyId: env.AWS_ACCESS_KEY_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
}

const s3Params = {
	Bucket: env.AWS_BUCKET
}

let S3 = new AWS(s3Config)

router.get('/email/list', jsonParser, (req, res) => {
	const designUrl = COUCH_FULL + '_design/EmailsByUpdatedDate/_view/EmailsByUpdatedDate'
	axios.get(designUrl, {
		params: {
			limit: 10,
			descending: true
		}
	})
	.then((emails) => {
		// console.log(emails.data)
		let data = emails.data
		console.log(data)
		res.send(data)
	}).catch((err) => {
		console.log(err)
		throw err
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

router.get('/email/:id', (req, res) => {
	let url = COUCH_FULL + req.params.id
	console.log(url)
	axios.get(url)
		.then((emailData) => {
			console.log(emailData.data)
			res.send(emailData.data)
		})
		.catch((err) => {
			console.log(err)
		})
})

router.post('/email/:id', jsonParser, (req, res) => {
	console.log(req.params.id)
	console.log(req.body)
	let url = COUCH_FULL + req.params.id
	axios.put(url, {
		data: req.body
	})
	.then((response) => [
		console.log(response)
	])
	// db.email.upsert(
	// 	Object.assign({}, req.body)
	// ).then(() => {
	// 	res.sendStatus(200)
	// }).catch((err)=>{
	// 	console.log(err)
	// 	res.status(500).send(err)
	// })
})


router.post('/email/create', jsonParser, (req,res) => {
	let { content, title } = req.body
	let createdAt = Utils.getCurrentTimestampUTC()

	axios.get(COUCH_UUID)
		.then((response) => {
			let uuid = response.data.uuids[0]
			return uuid
		})
		.then((uuid) => {
			return axios.put(uuid, {
				content,
				title,
				createdAt,
				updatedAt: createdAt
			})
			.then((putResponse)=>{
				res.send(putResponse.data)
			})
		})
		.catch((err) => {
			console.log(err)
		})
	
})


// router.post('/deleteEmail', jsonParser, (req, res) => {
// })

// router.post('/copyEmail', jsonParser, (req, res) => {
// 	const id = req.body.id[0]
// })

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
	let formattedFileName = Utils.formatS3Filename(req.file.originalname)
	let createParams = {
		Key: req.file.originalname,
		Bucket: s3Params.Bucket,
		ContentType: req.file.mimetype,
		ContentLength: req.file.size,
		Body: req.file.buffer
	}
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