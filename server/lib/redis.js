'use strict'

const Redis = require('ioredis')

module.exports = new Redis({
	port: 6379,
	host: '127.0.0.1',
	reconnectOnError: (err) => {
		const targetError = 'READONLY'
		return err.message.slice(0, targetError.length) === targetError
	}
})
