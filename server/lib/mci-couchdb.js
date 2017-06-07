'use strict'

const axios = require('axios')
const Promise = require('bluebird')
const Utils = require('./utils.js')
const merge = require('lodash.merge')
const COUCH_URL = process.env.COUCH_URL || 'http://localhost:5984'
const EMAIL_DB = process.env.EMAIL_DB || 'emails'
const couchdb = {}


// primitive building blocks

couchdb.getUniqueUUID = () => {
	return axios.get(`${COUCH_URL}/_uuids`).then(res => {
		return Promise.resolve(res.data.uuids[0])
	})
}

couchdb.getEmailByID = (id) => {
	return axios.get(`${COUCH_URL}/${EMAIL_DB}/${id}`)
}

couchdb.listEmails = (skip) => {
	return axios.get(`${COUCH_URL}/${EMAIL_DB}/_design/emails/_view/EmailsByUpdatedDate`, {
		params: {
			limit: 10,
			descending: true,
			skip: skip
		}
	})
}

couchdb.putEmail = (uuid, options) => {
	return axios.put(`${COUCH_URL}/${EMAIL_DB}/${uuid}`, merge({}, {
		// createdAt: Utils.getCurrentTimestampUTC(),
		updatedAt: Utils.getCurrentTimestampUTC()
	}, options))
}


couchdb.bulkPutEmails = (change_docs) => {
	return axios.post(`${COUCH_URL}/${EMAIL_DB}/_bulk_docs`, {
		docs: change_docs
	})
}


couchdb.searchEmails = (query) => {
	return axios.post(`${COUCH_URL}/${EMAIL_DB}/_find`, {
		selector: {
			title: query
		}
	})
}


// compound queries

couchdb.createEmail = (options) => {
	return couchdb.getUniqueUUID().then(uuid => {
		return couchdb.putEmail(uuid, options)
	})
}


couchdb.duplicateEmail = (uuid) => {
	return couchdb.getEmailByID(uuid).then(duplicate => {
		return couchdb.createEmail({
			contents: duplicate.data.contents,
			title: duplicate.data.title,
			template: duplicate.data.template || '',
			templates: duplicate.data.templates || [],
			author: duplicate.data.author,
			category: duplicate.data.category
		})
	})
}


couchdb.deleteEmails = (uuids) => {
	return Promise.map(uuids, (uuid) => {
		return couchdb.getEmailByID(uuid).then(res => {
			return {
				_rev: res.data._rev,
				_id: res.data._id,
				_deleted: true
			}
		})
	}).then(docs => {
		return couchdb.bulkPutEmails(docs)
	})
}

module.exports = couchdb
