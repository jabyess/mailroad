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

const COUCH_URL = env.COUCHDB_URL
const COUCH_DB = env.EMAIL_DB
const COUCH_UUID = COUCH_URL + '_uuids'
const COUCH_FULL = COUCH_URL + COUCH_DB + '/'
const COUCH_IMAGES = COUCH_URL + env.IMAGE_DB + '/_bulk_docs'
// const COUCH_SEARCH = COUCH_FULL + '_find'

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
	}
})

router.post('/email/search', jsonParser, (req, res) => {
	let searchText = req.body.searchText
	console.log('hit search', searchText)
	// axios.post(COUCH_SEARCH, {
	// 	selector: {
	// 		title: searchText
	// 	}
	// })
})

// router.post('/copyEmail', jsonParser, (req, res) => {
// 	const id = req.body.id[0]
// })

// AWS_BUCKET + .s3.amazonaws.com/ + data.key
router.get('/s3/list', (req, res) => {
	const approvedImageExtensions = ['.jpeg','.jpg','.png','.gif','.bmp']
	const listParams = {
		Bucket: s3Params.Bucket,
		Prefix: '150x150',
		EncodingType: 'url'
	}
	S3.listObjectsV2(listParams, (err, data) => {
		if(err) {
			console.log(err, err.stack)
			res.send(err)
		}
		else {
			let imagesArray = data.Contents.filter((image) => {
				if(approvedImageExtensions.some(ext => ext === path.extname(image.Key))) { 
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

const randomLength = '1340373163133890020170215113235'.length
router.post('/s3/delete', jsonParser, (req, res) => {
	const random = req.body.key.split('-')[1]

	S3.listObjectsV2(s3Params).promise().then((s3Objects) => {
		console.log(s3Objects)
		console.log(random)
		console.log(randomLength)
		let deleteKeys = s3Objects.Contents.filter((obj) => {
			if(obj.Key.includes(random)) {
				return obj.Key
			}
		})
		console.log('deletekeys', deleteKeys)
		// return val.CommonPrefixes

	})
	// console.log(req.body)
	// S3.deleteObject(deleteParams, (err, data) => {
	// 	if(err) {
	// 		console.log(err)
	// 	}
	// 	else {
	// 		console.log(data)
	// 		res.sendStatus(200)
	// 	}
	res.sendStatus(200)

	// })
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

		let dbUploadPromise = [axios.post(COUCH_IMAGES, {
			docs: flatDBUploadDocs
		})]

		// flatten all promises into one array for promise.all
		const allPromises = dbUploadPromise.concat([].concat.apply([], s3UploadPromises))

		Promise.all(allPromises)
		.then((allUploaded) => {
			console.log(allUploaded)
			res.status(200).send('uploaded')
		})

	})
	.catch((err) => {
		console.log('error in /s3/create', err)
		throw err
	})
	
})

export { router as API }