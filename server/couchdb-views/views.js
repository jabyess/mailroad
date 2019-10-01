const tools = require('couchdb-tools')
const emails = require('./emails.js')
const images = require('./images.js')
const dotenv = require('dotenv')
const args = process.argv.slice(2)
const axios = require('axios')

dotenv.config()

const emailViews = tools.ddoc(emails)
const imageViews = tools.ddoc(images)

const { COUCHDB_URL, ADMIN_USER, ADMIN_PASS } = process.env

const allViews = {
	emails: emailViews,
	images: imageViews
}

if(args.some(a => a === 'sync')) {
	for(let view in allViews) {

		const url = `${COUCHDB_URL}${view}/${allViews[view]._id}`

		console.log(url)

		axios.get(url)
			.then(res => {
				let dbDoc = res.data
				let newDoc = allViews[view]
				newDoc._rev = dbDoc._rev

				axios({
					url: url,
					method: 'PUT',
					auth: {
						username: ADMIN_USER,
						password: ADMIN_PASS
					},
					data: allViews[view]
				})
				.then(res => {
					const obj = res.data
					console.log('synced ', obj)
				})
				.catch(err => {
					console.log('error syncing existing doc', err.response.data)
				})
			})
			.catch(() => {
				axios({
					url: url,
					method: 'PUT',
					auth: {
						username: ADMIN_USER,
						password: ADMIN_PASS
					},
					data: allViews[view]
				})
				.then(res => {
					const obj = res.data
					console.log(obj.id, 'did not exist, synced', obj)
				})
				.catch(err => {
					console.log('error syncing nonexistent doc', err.response.data)
				})
			})
	}


}