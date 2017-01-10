let PouchDB = require('pouchdb-browser')
const ID_PREFIX = 'pdb_'
const DATE_STRING = "YYYY-MM-DDThh:mm:ssTZD"

export default class PDB {
	constructor(dbname) {
		this.pouchDB = new PouchDB(dbname)
	}

	getInfo() {
		this.pouchDB.info().then((info)=> {
			console.log(info)
		})
	}

	createOrUpdateDoc(doc) {
		let docID = ID_PREFIX + doc.id
		this.pouchDB.get(docID).catch((err) => {
			if(err && err.name === 'not_found') {
				return {
					_id: docID,
					id: doc.id,
					content: [],
					title: '',
					createdAt: new Date(DATE_STRING).getTime(),
					updatedAt: new Date().getTime()
				}
			}
			else {
				console.log(err)
				throw err
			}
		}).then((newDoc)=>{
			// newDoc.content = doc.content
			newDoc = Object.assign(newDoc, doc)
			console.log(newDoc)
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
			console.log(doc)
			newDoc.content[doc.index] = Object.assign({}, doc)
			newDoc.modified = doc.modified
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