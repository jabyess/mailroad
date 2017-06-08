const fs = require('fs')
const https = require('https')
const app = require('./app.js')
const PORT = process.env.PORT || 33224

let server

if (process.env.NODE_ENV === 'production') {
	server = app
} else {
	server = https.createServer({
		// https://matoski.com/article/node-express-generate-ssl/
		key: fs.readFileSync('server/ssl/server.key'),
		cert: fs.readFileSync('server/ssl/server.crt'),
		ca: fs.readFileSync('server/ssl/ca.crt'),
		requestCert: true,
		rejectUnauthorized: false
	}, app)
}

server.listen(PORT, () => {
	console.log(`Express listening on port ${PORT}!`)
})
