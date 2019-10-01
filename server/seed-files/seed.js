const dotenv = require("dotenv")
const categories = require("./categories.json")
const databases = require("./databases.json")
const axios = require("axios")
const parseCookie = require("../lib/utils").parseCookie

dotenv.config()

const { COUCHDB_URL, ADMIN_USER, ADMIN_PASS, META_DB } = process.env

// authenticate as admin
axios
	.post(
		`${COUCHDB_URL}_session/`,
		// params must be sent in this format. idk why. couchdb amirite.
		`name=${ADMIN_USER}&password=${ADMIN_PASS}`,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	)
	.then(response => {
		let token = parseCookie(response.headers["set-cookie"])
		return token
	})
	.then(token => {
		// create databases in databases.json
		databases.forEach(db => {
			let url = COUCHDB_URL + db.name

			return axios
				.put(
					url,
					{},
					{
						headers: {
							Cookie: `AuthSession=${token}`,
							"X-CouchDB-WWW-Authenticate": "Cookie",
							"Content-Type": "application/x-www-form-urlencoded"
						}
					}
				)
				.then(() => {
					console.log("Created db:", db.name)
				})
				.catch(err => {
					console.error("Error creating database:", db.name, err.response.data)
				})
		})
		return token
	})
	.then(token => {
		const metaURL = COUCHDB_URL + META_DB + "/categories"
		axios
			.put(metaURL, {
				categories
			})
			.then(done => {
				console.log(done.data)
			})
			.catch(err => {
				console.error("error creating categories", err.response)
			})
	})
	.catch(authErr => {
		console.error(authErr)
	})
