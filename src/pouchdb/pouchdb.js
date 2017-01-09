let PouchDB = require('pouchdb-browser')

export default class PDB {
	constructor(dbname) {
		this.pouchDB = new PouchDB(dbname)
	}

	getInfo() {
		this.pouchDB.info().then((info)=> {
			console.log(info)
		})
	}

	partialDocUpdate(doc) {
		this.pouchDB.get(doc._id).catch((err) => {
			console.log(err)
			if(err.name === 'not_found') {
				return {
					_id: doc._id,
					content: []
				}
			}
			else {
				throw err
			}
		}).then((newDoc) => {
			console.log(doc)
			newDoc.content[doc.index] = {
				content: doc.emailContent,
				editorType: doc.editorType
			}
			console.log(newDoc)
			return this.pouchDB.put(newDoc)
		})
	}

	deleteDoc(id) {
		this.pouchDB.get(id).then((doc) => {
			return this.pouchDB.remove(doc)
		})
		console.log('deleted ', id)
	}

	getDoc(id) {
		this.pouchDB.get(id).then((doc) => {
			return doc
		}).catch((err) => {
			if(err) {
				console.log(err)
				throw err
			}
		})
	}


}