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
		let data = emails.data
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
			let fileList = files.map( (f) => {
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


router.post('/email/create', jsonParser, (req,res) => {
	const { content, title } = req.body
	const createdAt = Utils.getCurrentTimestampUTC()
	const updatedAt = Utils.getCurrentTimestampUTC()
	
	axios.get(COUCH_UUID)
		.then((response) => {
			console.log('---couch_uuid response---')
			console.log(response.data)
			let uuid = response.data.uuids[0]
			return uuid
		})
		.then((uuid) => {
			let url = COUCH_FULL + uuid
			return axios.put(url, {
				content,
				title,
				createdAt,
				updatedAt
			})
			.then((putResponse) => {
				let url = COUCH_FULL + putResponse.data.id
				return axios.get(url)
					.then((getResponse) => {
						res.send(getResponse.data)
						return getResponse.data
					})
			}).catch((rejectError) => {
				res.send(rejectError)
				return rejectError
			})
		})
		.catch((err) => {
			console.log('---error in /email/create---')
			console.log(err)
		})
	
})

router.get('/email/:id', (req, res) => {
	let url = COUCH_FULL + req.params.id
	axios.get(url)
		.then((emailData) => {
			res.send(emailData.data)
		})
		.catch((err) => {
			console.log(err)
		})
})


// router.post('/email/:id', jsonParser, (req, res) => {
// 	console.log(req.body.data)

// 	let url = COUCH_FULL + req.params.id
// 	let { content, title, template, createdAt } = req.body
// 	let updatedAt = Utils.getCurrentTimestampUTC()

// 	axios.put(url, {
// 		content, 
// 		title,
// 		updatedAt,
// 		createdAt,
// 	})
// 	.then((response) => {
// 		console.log(response.data)
// 		res.send(response.data)
// 	})
// 	.catch((err) => {
// 		console.log(err)
// 		res.send(err)
// 	})

// })

router.delete('/email', jsonParser, (req, res) => {
	if(req.query && req.query.id) {
		const ids = req.query.id

		console.log('ids:', ids)

		let idsToDelete = ids.map((id) => {
			let url = COUCH_FULL + id
			return axios.get(url).then((result) => {
				let { _rev } = result.data
				return { id, _rev }
			})
			.catch((error) => {
				console.log(error)
			})
		})


		Promise.all(idsToDelete).then((deleteObject) => {
			return deleteObject.map(({id, _rev}) => {
				console.log(id, _rev)
				let url = COUCH_FULL + id
				return axios.delete(url, {
					params: { rev: _rev }
				}).then((deleted) => {
					console.log(deleted.data)
				}).catch((err) => {
					console.log('err deleting', err.data)
				})
			})
		}, rejected => {
			console.log('rejected', rejected.data)
		}).then((returned) => {
			console.log('returned', returned)
			res.sendStatus(200)
		})

		// new Promise((resolveDelete, rejectDelete) => {
		// 	return 
		// }).then((resultsOfMap) => {
		// 	console.log('results', resultsOfMap)
		// 	// console.log(idsToDelete)
		// 	res.sendStatus(200)
		// }).catch((catchDeleteError) => {
		// 	console.log(catchDeleteError)
		// })

		// let idsToDelete = new Promise(, (rejected) => {console.log(rejected)})
		// .then((doit) => {
		// 	console.log(doit)
		// }))

	}

})

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
			let imagesArray = data.Contents.filter((image) => {
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