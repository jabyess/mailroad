const axios = require('axios')
const dotenv = require('dotenv')
const winston = require('winston')


dotenv.config()

const { MAILGUN_API_KEY, MAILGUN_URL } = process.env

class Mailgun {
	constructor(opts) {
		this.emailDefaults = {
			from: 'jbyess@morningconsult.com',
			to: 'mailroadtest@e.morningconsultintelligence.com',
			subject: 'test subject line',

		}
		
		this.emailOpts = Object.assign({}, opts, this.emailDefaults)

	}
	
	sendToList(html) {
		// winston.log(html)
		let listOptions = Object.assign({}, this.emailOpts, html)
		axios.post('https://api.mailgun.net/v3/e.morningconsultintelligence.com', {
			auth: {
				username: 'api',
				password: MAILGUN_API_KEY
			},
			data: listOptions
		})
		.then(response => {
			winston.log('response')
			winston.log(response)
		})
		.catch(err => {
			winston.error(err)
		})
		// console.log(listOptions)


	}

}


module.exports = Mailgun