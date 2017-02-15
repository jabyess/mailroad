import moment from 'moment'
import PouchDB from 'pouchdb-browser'

export default class PDB {

	constructor() {
		this.imageDBName = process.env.IMAGE_DB
		this.emailDBName = process.env.EMAIL_DB
		this.pouchDBURL = process.env.COUCHDB_URL

		console.log(process.env)
		this.emailDB = new PouchDB(this.emailDBName, {auto_compaction: true})
		this.imageDB = new PouchDB(this.imageDBName, {auto_compaction: true})
	}

	syncEverything(syncCompleteCallback) {
		PouchDB.sync(this.emailDBName, this.pouchDBURL + this.emailDBName, {
			pull: {
				query_params: {
					limit: 10
				}
			}
		})
		.on('complete', (complete) => {
			console.log('completed full sync', complete)
			syncCompleteCallback(complete)
		})
	}

	syncToDB(doc, saveCompleteCallback) {
		this.emailDB.get(doc._id).then((newDoc) => {
			// console.log('saving', newDoc, 'to db')
			PouchDB.replicate(this.emailDBName, this.pouchDBURL + this.emailDBName, {
				doc_ids: [ doc._id ]
			})
			.on('complete', (complete) => {
				console.log('save to db replicate complete', complete)
				saveCompleteCallback(complete)
			})
		})
	}

	updateDoc(doc) {
		this.emailDB.get(doc._id).catch((error) => {
			console.error('error in updateDoc get', error)

			if(error.name === 'not_found') {

				PouchDB.replicate(this.pouchDBURL + this.emailDBName, this.emailDBName)
				.on('complete', () => {

					return this.emailDB.get(doc._id).then((newDoc) => {
						console.log('getting doc for second time', newDoc)
						return newDoc
					})
				})
			}
		}).then((newDoc) => {
			if(newDoc) {
				console.log('returned updateDoc', newDoc)
				let updatedDoc = Object.assign({}, newDoc, doc)
				updatedDoc._rev = newDoc._rev
				updatedDoc.updatedAt = moment.utc().format()

				this.emailDB.put(updatedDoc).then((putSuccess) => {
					console.log('putSuccess', putSuccess)
					return putSuccess
				},
				(rejected) => {
					console.info('updateDoc put rejected', rejected)
					return rejected
				})
				.catch((error) => {
					console.error('updateDoc put error', error)
				})
			}
		})
		
	}

	deleteDoc(id) {
		this.emailDB.get(id).then((doc) => {
			return this.emailDB.remove(doc)
		})
		// console.log('deleted ', id)
	}

	getDoc(id, returnValueCallback) {
		this.emailDB.get(id).then((result) => {
			returnValueCallback(result)
		},
		(notFound) => {
			console.error('doc not found in PDB')
			PouchDB.replicate(this.pouchDBURL + this.emailDBName, this.emailDBName, {
				doc_ids: [ id ]
			})
			.on('complete', (complete) => {
				this.emailDB.get(id).then((result) => {
					returnValueCallback(result)
				})
				.catch((error) => {
					console.error('error in getDoc after replicate', error)
				})
			})
		})
		.catch((err) => {
			console.error('error in getDoc', err)
		})
	}

	// createImages(images, callback) {
	// 	console.log(images)
	// 	const pouchImages = images.map((image) => {
			
	// 		return {
	// 			_id: image.Key,
	// 			size,
	// 			grouping
	// 		}
	// 	})
	// 	console.log(pouchImages)
	// 	this.imageDB.bulkDocs(pouchImages)
	// 	callback('success')
	// }


}