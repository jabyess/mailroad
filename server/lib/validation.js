'use strict'

const Joi = require('joi')
const merge = require('lodash.merge')

exports.validate = (schema, options) => {
	return function (req, res, next) {
		const opts = options || { stripUnknown: true }
		const config = merge({}, req.query, req.params, req.body)

		const csrf = req.get('X-CSRF-TOKEN')
		if (csrf) {
			config._csrf = csrf
		}

		Joi.validate(config, schema, opts, (err, result) => {
			if (err) {
				return res.status(400).type('text/plain').send(err.message)
			}

			req.joi = result
			next()
		})
	}
}

exports.schema = {
	emails: {
		list: Joi.object().keys({
			skip: Joi.number().optional().min(0).error(Error('Invalid "skip" parameter.'))
		}),
		create: Joi.object().keys({
			contents: Joi.array().required().error(Error('Invalid "contents" parameter.')),
			title: Joi.string().required().error(Error('Invalid "title" parameter.'))
		}),
		duplicate: Joi.object().keys({
			id: Joi.string().required().min(0).error(Error('Invalid "id" parameter.'))
		}),
		getOne: Joi.object().keys({
			id: Joi.string().required().min(0).error(Error('Invalid "id" parameter.'))
		}),
		delete: Joi.object().keys({
			id: Joi.array().items(Joi.string().required()).single().required().error(Error('Invalid "id" parameter.'))
		}),
		search: Joi.object().keys({
			searchText: Joi.string().required().error(Error('Invalid "searchText" parameter.'))
		}),
		compile: Joi.object().keys({
			context: Joi.object().required().error(Error('Invalid "context" parameter.'))
		})
	}
}
