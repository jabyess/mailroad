const dotenv = require("dotenv")
const categories = require("./categories.json")
const databases = require("./databases.json")
const axios = require("axios")
const parseCookie = require("../lib/utils").parseCookie

dotenv.config()

const { COUCHDB_URL, ADMIN_USER, ADMIN_PASS } = process.env

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
		console.log(token)
		databases.forEach(db => {
			let url = COUCHDB_URL + db.name
			axios.interceptors.request.use(function(config) {
				// Do something before request is sent
				console.log(config)
				return config
			})

			axios
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
	})

// create databases
// categories.forEach(cat => {
