import moment from 'moment'
import PouchDB from 'pouchdb-browser'

export default class PDB {

	constructor(dbname) {
		this.dbname = dbname
		this.pouchDB = new PouchDB(dbname, {auto_compaction: true})
	}

	syncEverything(syncCompleteCallback) {
		PouchDB.sync(this.dbname, 'http://localhost:5984/' + this.dbname, {
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
		this.pouchDB.get(doc._id).then((newDoc) => {
			// console.log('saving', newDoc, 'to db')
			PouchDB.replicate(this.dbname, 'http://localhost:5984/' + this.dbname, {
				doc_ids: [ doc._id ]
			})
			.on('complete', (complete) => {
				console.log('save to db replicate complete', complete)
				saveCompleteCallback(complete)
			})
		})
	}

	updateDoc(doc) {
		this.pouchDB.get(doc._id).catch((error) => {
			console.error('error in updateDoc get', error)

			if(error.name === 'not_found') {

				PouchDB.replicate('http://localhost:5984' + this.dbname, this.dbname)
				.on('complete', () => {

					return this.pouchDB.get(doc._id).then((newDoc) => {
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

				this.pouchDB.put(updatedDoc).then((putSuccess) => {
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
		this.pouchDB.get(id).then((doc) => {
			return this.pouchDB.remove(doc)
		})
		// console.log('deleted ', id)
	}

	getDoc(id, returnValueCallback) {
		this.pouchDB.get(id).then((result) => {
			returnValueCallback(result)
		},
		(notFound) => {
			console.error('doc not found in PDB')
			PouchDB.replicate('http://localhost:5984/' + this.dbname, this.dbname, {
				doc_ids: [ id ]
			})
			.on('complete', (complete) => {
				this.pouchDB.get(id).then((result) => {
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


}