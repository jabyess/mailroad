let PouchDB = require('pouchdb-browser')
let moment = require('moment')

const ID_PREFIX = 'pdb_'
// const TIMEZONE_OFFSET = new Date().getTimezoneOffset()
// const DATE_STRING = "YYYY-MM-DDThh:mm:ss" + TIMEZONE_OFFSET
const DATE_STRING = "YYYY-MM-DD HH:mm:ss.SSSZ"
// 2017-01-11 14:19:51.045-05 in db
// 2017-01-11T19:32:11.926Z returned in js

export default class PDB {
	constructor(dbname) {
		this.pouchDB = new PouchDB(dbname, {auto_compaction: true})
	}

	createOrUpdateDoc(doc) {
		let docID = ID_PREFIX + doc.id
		this.pouchDB.get(docID).catch((err) => {
			if(err && err.name === 'not_found') {
				console.log('---doc not found---')
				return {
					_id: docID,
					id: doc.id,
					content: [],
					title: ''
				}
			}
			else {
				console.log(err)
				throw err
			}
		}).then((newDoc) => {
			console.log("newDoc ", newDoc);
			console.log("doc ", doc);
			let newDocRev = newDoc._rev
			newDoc = Object.assign(newDoc, doc)
			if(newDocRev) {
				console.log("newDocRev ", newDocRev);
				newDoc._rev = newDocRev
			}
			newDoc.updatedAt = moment().format(DATE_STRING)
			console.log(newDoc.updatedAt)
			this.pouchDB.put(newDoc)
		})
	}

	partialDocUpdate(doc) {
		let docID = ID_PREFIX + doc.id
		this.pouchDB.get(docID).catch((err) => {
			console.log(err)
			if(err.name === 'not_found') {
				return {
					_id: doc._id,
					content: [],
				}
			}
			else {
				throw err
			}
		}).then((newDoc) => {
			newDoc.content[doc.index] = Object.assign({}, doc)
			newDoc.updatedAt = moment().format(DATE_STRING)
			return this.pouchDB.put(newDoc)
		})
	}

	deleteDoc(id) {
		this.pouchDB.get(id).then((doc) => {
			return this.pouchDB.remove(doc)
		})
		console.log('deleted ', id)
	}

	getDoc(id, callback) {
		let docID = ID_PREFIX + id
		this.pouchDB.get(docID).catch((err) => {
			if(err && err.name === 'not_found') {
				return err
			}
			else return null
		}).then((doc) => {
			return callback(doc)
		})
	}


}