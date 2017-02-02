let PouchDB = require('pouchdb-browser')
import moment from 'moment'

export default class PDB {

	constructor(dbname) {
		this.dbname = dbname
		this.pouchDB = new PouchDB(dbname, {auto_compaction: true})
	}

	syncEverything() {
		PouchDB.sync(this.dbname, 'http://localhost:5984/' + this.dbname, {
			pull: {
				query_params: {
					limit: 10
				}
			}
		})
		.on('complete', (complete) => {
			console.log('completed full sync', complete)
		})
	}

	updateDoc(doc) {
		this.pouchDB.get(doc._id).then((newDoc) => {
			if(newDoc) {
				
				let updatedDoc = Object.assign({}, newDoc, doc)
				updatedDoc._rev = newDoc._rev
				updatedDoc.updatedAt = moment().format()

				this.pouchDB.put(updatedDoc).then((putSuccess) => {
					Promise.resolve(putSuccess)
				},
				(rejected) => {
					console.info('syncDoc put rejected', rejected)
				})
				.catch((error) => {
					console.error('syncDoc put error', error)
				})
			}
		})
		.catch((error) => {
			console.error('error in getdoc SyncDoc', error)
		})
	}

	deleteDoc(id) {
		this.pouchDB.get(id).then((doc) => {
			return this.pouchDB.remove(doc)
		})
		console.log('deleted ', id)
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