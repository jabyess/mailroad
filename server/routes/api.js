import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import Utils from '../lib/utils.js'
import multer from 'multer'
import Promise from 'bluebird'
import AWS from 'aws-sdk/clients/s3'
import axios from 'axios'
import sharp from 'sharp'

dotenv.config()

let upload = multer()
let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env


const COUCH_URL = env.COUCHDB_URL // http://localhost:5984/
const COUCH_UUID = COUCH_URL + '_uuids' // http://localhost:5984/uuids
const COUCH_EMAILS = COUCH_URL + env.EMAIL_DB + '/' // http://localhost:5984/emails/
const COUCH_EMAILS_FIND = COUCH_EMAILS + '_find' // http://localhost:5984/emails/_find
const COUCH_IMAGES = COUCH_URL + env.IMAGE_DB + '/' // http://localhost:5984/images/
const COUCH_IMAGES_BULK = COUCH_IMAGES + '_bulk_docs' // http://localhost:5984/images/_bulk_docs
const COUCH_IMAGES_FIND = COUCH_IMAGES + '_find' // http://localhost:5984/images/_find

const s3Config = {
	region: env.AWS_REGION,
	accessKeyId: env.AWS_ACCESS_KEY_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
}

const s3Params = {
	Bucket: env.AWS_BUCKET
}

let S3 = new AWS(s3Config)

router.get('/email/list/:skip?', jsonParser, (req, res) => {
	const designUrl = COUCH_EMAILS + '_design/EmailsByUpdatedDate/_view/EmailsByUpdatedDate'
	const skip = req.query && req.query.skip ? req.query.skip : null
	axios.get(designUrl, {
		params: {
			limit: 10,
			descending: true,
			skip: skip
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
			throw Error('error reading templates: ', err)
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
	console.log(req.body)
	Utils.getCompiledHandlebarsTemplate(req.body.context, (compiledTemplate) => {
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
			let uuid = response.data.uuids[0]
			return uuid
		})
		.then((uuid) => {
			let url = COUCH_EMAILS + uuid
			return axios.put(url, {
				content,
				title,
				createdAt,
				updatedAt
			})
			.then((putResponse) => {
				let url = COUCH_EMAILS + putResponse.data.id
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
	let url = COUCH_EMAILS + req.params.id
	axios.get(url)
		.then((emailData) => {
			res.send(emailData.data)
		})
		.catch((err) => {
			console.log(err)
		})
})

router.delete('/email', jsonParser, (req, res) => {
	if(req.query && req.query.id) {
		const ids = req.query.id

		console.log('ids:', ids)

		let idsToDelete = ids.map((id) => {
			let url = COUCH_EMAILS + id
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
				let url = COUCH_EMAILS + id
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
	}
})

router.post('/email/search', jsonParser, (req, res) => {
	let searchText = req.body.searchText
	console.log('hit search', searchText)
	axios.post(COUCH_EMAILS_FIND, {
		selector: {
			title: searchText
		}
	})
	.then((response) => {
		console.log(response)
		res.send(response)
	})
})

// router.post('/copyEmail', jsonParser, (req, res) => {
// 	const id = req.body.id[0]
// })

router.get('/s3/list/:grouping', (req, res) => {
	if(req.params && req.params.grouping) {
		axios.post(COUCH_IMAGES_FIND, {
			selector: {
				grouping: req.params.grouping
			}
		})
		.then((results) => {
			console.log(results.data.docs)
			res.send(results.data)
		})
		.catch((err) => {
			console.log('error in /s3/list/:grouping', err)
		})
	}
	else {
		res.status(400).send('Invalid parameters')
	}
}) 

router.get('/s3/list/:skip?', (req, res) => {
	const skip = req.query && req.query.skip ? req.query.skip : null
	const url = COUCH_IMAGES + '_design/ImagesByDate/_view/ImagesByDate'

	axios.get(url, {
		params: {
			descending: true,
			limit: 10,
			skip: skip
		}
	}).then((imageResults) => {

		const images = {
			totalRows: imageResults.data.total_rows,
			images: imageResults.data.rows.map((image) => {
				return {
					url: image.value.url,
					size: image.value.size,
					grouping: image.value.grouping,
					date: image.key,
					id: image.id,
				}
			})
		}
		
		res.status(200).send(images)
	})

})

router.post('/s3/delete', jsonParser, (req, res) => {
	const fileName = req.body.fileName.split('-')
	const grouping = fileName[2]

	axios.post(COUCH_IMAGES_FIND, {
		selector: {
			grouping: grouping
		}
	})
	.then(response => {
		//build delete objects to pass to methods below
		if(!response && !response.data) {
			return false
		}

		const couchDeleteDocs = response.data.docs.map(doc => {
			return {
				id: doc._id,
				rev: doc._rev
			}
		})

		const s3DeleteDocs = response.data.docs.map(doc => {
			return {
				Key: doc._id
			}
		})

		const deleteDocs = {
			couchDeleteDocs, s3DeleteDocs
		}

		return deleteDocs
	})
	.then(docsToDelete => {
		const couchDeletePromises = docsToDelete.couchDeleteDocs.map((doc) => {
			let url = COUCH_IMAGES + doc.id
			return axios.delete(url, {
				params: {
					rev: doc.rev
				}
			}).catch(err => {
				console.log('error deleting image from couchdb', err)
				return err
			})
		})

		const s3DeletePromise = S3.deleteObjects({
			Bucket: s3Params.Bucket,
			Delete: {
				Objects: docsToDelete.s3DeleteDocs
			}
		}).promise()

		const allPromises = couchDeletePromises.concat(s3DeletePromise)
		return allPromises
	})
	.then(allPromises => {
		return Promise.all(allPromises).then((successDelete) => {
			console.log('successfully deleted image', successDelete)

		})
		.catch((err) => {
			console.log('error deleting images', err)
			return err
		})
	})
	.then((allResolved) => {
		res.sendStatus(200)
		return allResolved
	})
	.catch(err => {
		console.log('error in /s3/delete', err)
		res.status(500).send(err)
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
const multerImageUpload = upload.fields([
	{ name: 'droppedFiles' },
	{ name: 'sizes' }
])

router.post('/s3/create', multerImageUpload, (req, res) => {

	const sizes = JSON.parse(req.body.sizes)
	const files = req.files.droppedFiles
	const fileRandom = files.map(() => {
		return Math.floor(Math.random() * 10000000000)
	})

	// //make sure we generate a thumbnail size
	sizes.forEach((imageSize) => {
		// console.log('imageSize', imageSize)
		if(!imageSize.some((size) => size.width === 150 && size.height === 150)) {
			imageSize.push({ width: 150, height: 150 })
		}
	})

	//run images through sharp resizer
	//format filenames
	//keep in nested array structure
	Promise.map(files, (file, i) => {
		return Promise.map(sizes[i], (size) => {
			return new Promise((resolve) => {
				resolve(sharp(file.buffer).resize(size.width, size.height).max().toBuffer())
			}).then(resolvedBuffer => {
				return {
					Bucket: s3Params.Bucket,
					Key: Utils.formatS3Filename(file.originalname, size.width, size.height, fileRandom[i]),
					Body: resolvedBuffer,
				}
			})
		})
		.then((sizes) => sizes)
		.catch(err => Error(err))
	})
	.then(s3ImageObjects => {
		const s3UploadPromises = s3ImageObjects.map(images => {
			return images.map(size => {
				return S3.putObject(size).promise().catch(err => {
					console.log('error uploading to s3', err)
					return err
				})
			})
		})

		const dbUploadDocs = s3ImageObjects.map(imageObjects => {
			return imageObjects.map(imageObject => {
				const imageName = imageObject.Key.split('-'),
					size = imageName[0],
					date = imageName[1],
					grouping = imageName[2],
					filename = imageName[3]

				return {
					_id: imageObject.Key,
					url: Utils.formatImageDocURL(env.AWS_BUCKET, imageObject.Key),
					date, 
					grouping,
					filename,
					size
				}
			})
		})

		const flatDBUploadDocs = [].concat.apply([], dbUploadDocs)

		let dbUploadPromise = [axios.post(COUCH_IMAGES_BULK, {
			docs: flatDBUploadDocs
		})]

		// flatten all promises into one array for promise.all
		const allPromises = dbUploadPromise.concat([].concat.apply([], s3UploadPromises))

		Promise.all(allPromises).then(() => {
			res.sendStatus(200)
		})

	})
	.catch((err) => {
		console.log('error in /s3/create', err)
		throw err
	})
	
})

export { router as API }