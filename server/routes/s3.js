const dotenv= require('dotenv')
const Promise= require('bluebird')
const express= require('express')
const bodyParser= require('body-parser')
const AWS= require('aws-sdk/clients/s3')
const sharp= require('sharp')
const multer= require('multer')
const axios= require('axios')
const Utils= require('../lib/utils.js')

dotenv.config()

let upload = multer()
let router = express.Router()
let jsonParser = bodyParser.json()
const env = process.env

const COUCH_URL = env.COUCHDB_URL // http://localhost:5984/
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

router.get('/list/:grouping', (req, res) => {
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

router.get('/list/:skip?', (req, res) => {
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

router.post('/delete', jsonParser, (req, res) => {
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

router.post('/create', multerImageUpload, (req, res) => {

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

module.exports = router