let PouchDB = require('pouchdb-browser')
import moment from 'moment'

// const TIMEZONE_OFFSET = new Date().getTimezoneOffset()
// const DATE_STRING = "YYYY-MM-DDThh:mm:ss" + TIMEZONE_OFFSET
const DATE_STRING = "YYYY-MM-DDTHH:mm:ssssZ"
// 2017-01-11 14:19:51.045-05 in db
// 2017-01-11T19:32:11.926Z returned in js

export default class PDB {
	constructor(dbname) {
		this.dbname = dbname
		this.pouchDB = new PouchDB(dbname, {auto_compaction: true})

		let sync = PouchDB.sync(this.dbname, 'http://localhost:5984/' + this.dbname, {
			retry: true,
			live: true,
			pull: {
				filter: '_view',
				view: 'EmailsByUpdatedDate/EmailsByUpdatedDate',
				query_params: { 'limit' : '10' }
			}
		}).on('change', (info) => {
			console.log('change', info)
		}).on('complete', (complete) => {
			console.log("complete ", complete)
		})
	}


	syncDoc(doc) {
		console.log('syncDoc', doc)
		this.pouchDB.put(doc).then((success) => {
			console.log('successfully put', success)
		},(reject) => {
			console.log('rejected put because', reject)
		})

	}


	// createOrUpdateDoc(oldDoc) {
	// 	console.log("oldDoc ", oldDoc);
	// 	this.pouchDB.get(oldDoc._id).catch((err) => {
	// 		if(err && err.name === 'not_found') {
	// 			this.pouchDB.replicate.from('http://localhost:5984/emailbuilder', {
	// 				doc_ids: [ oldDoc._id ]
	// 			}).on('change', (info) => {
	// 				console.log('change', info)
	// 			}).on('complete', (complete) => {
	// 				console.log("complete ", complete)
	// 			})
	// 		}
	// 		else {
	// 			return Promise.reject(err)
	// 		}
	// 	}).then((returnedDoc) => {
	// 		console.log('returnedDoc:', returnedDoc)

	// 		let newDoc = {}

	// 		Object.assign(newDoc, returnedDoc, oldDoc)

	// 		if(returnedDoc._rev) {
	// 			console.log(returnedDoc._rev, newDoc._rev, oldDoc._rev)
	// 			newDoc._rev = returnedDoc._rev
	// 		}
	// 		console.log("newDoc ", newDoc);
	// 		newDoc.updatedAt = moment.utc().format()
	// 		return this.pouchDB.put(newDoc)
	// 	})
	// }

	// partialDocUpdate(doc) {
	// 	let docID = ID_PREFIX + doc.id
	// 	this.pouchDB.get(docID).catch((err) => {
	// 		console.log(err)
	// 		if(err.name === 'not_found') {
	// 			return {
	// 				_id: doc._id,
	// 				content: [],
	// 			}
	// 		}
	// 		else {
	// 			throw err
	// 		}
	// 	}).then((newDoc) => {
	// 		newDoc.content[doc.index] = Object.assign({}, doc)
	// 		newDoc.updatedAt = moment().format(DATE_STRING)
	// 		return this.pouchDB.put(newDoc)
	// 	})
	// }

	deleteDoc(id) {
		this.pouchDB.get(id).then((doc) => {
			return this.pouchDB.remove(doc)
		})
		console.log('deleted ', id)
	}



// PouchDB.replicate('http://localhost:5984/' + this.dbname, this.dbname, {
// 					doc_ids: [ id ]
// 				}).then((resolved) => {
// 					console.log('resolved', resolved)
// 					Promise.resolve(resolved)
// 				},(rejected) => {
// 					Promise.reject(rejected)
// 				}).catch((err) => {
// 					console.log('error in getDoc', err)
// 				})
	getDoc(id, returnValueCallback) {
		console.log('getting doc')
		this.pouchDB.get(id).then((result) => {
			console.log('getDoc result', result)
			returnValueCallback(result)
		}, (notFound) => {
			console.log('doc not found', notFound)
			PouchDB.replicate('http://localhost:5984/' + this.dbname, this.dbname, {
				doc_ids: [ id ]
			}).on('complete', (complete) => {
				console.log('replicate complete', complete)
				returnValueCallback(null)
			})
		}).catch((err) => {
			console.log('error in getting doc', err)

		})
	}


}