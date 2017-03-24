const mjml = require('mjml')
const mjml2html = mjml.mjml2html
const Handlebars = require('handlebars')
const fs = require('fs')
const juice = require('juice')
const paths = require('../../config/paths')


class MJML {

	constructor() {
		Handlebars.registerHelper('ifeq', (a, b, options) => {
			if (arguments.length === 2) {
				options = b
				b = options.hash.compare
			}
			if (a === b) {
				return options.fn(this)
			}
			return options.inverse(this)
		})

	}

	compileToMJML(html) {
		const output = mjml2html(html)
		return output
	}

	parseHandlebars(content, template, callback) {
		fs.readFile(`${paths.mjml}/${template}.mjml`, 'utf8', (err, file) => {
			if(err) {
				console.log(err)
				return
			}
			else {
				console.log(content)
				let compiled = Handlebars.compile(file)
				console.log(compiled)
				let result = compiled(content)
				console.log(result)
				callback(result)
			}
		})
	}

	inlineCSS(html, opts) {
		const defaultOptions = {
			inlinePseudoElements: false,
			preserveImportant: true
		}

		let options = Object.assign({}, opts, defaultOptions)
		const inlined = juice(html, options)

		return inlined
	}
}

module.exports = MJML