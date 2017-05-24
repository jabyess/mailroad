const app = require('./app.js')
const axios = require('axios')

// on startup, should check to see if database connection is good.
// if so, start db
const EPORT = 33224

axios.get(process.env.COUCHDB_URL)
.then((response) => {
	if(response && response.data) {
		app.listen(EPORT, () => {
			console.log(`Express listening on port ${EPORT}!`)
		})
		return response
	}
	else {
		throw new Error('Could not connect to couchDB. Please check your config.')
	}
})
.catch(err => {
	console.log(err)
	throw err
})
