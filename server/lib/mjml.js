const mjml = require('mjml')
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
		let output = mjml.mjml2html(html)
		return output
	}

	parseHandlebars(content, template) {
		let mjmlFile = fs.readFileSync(`${paths.mjml}/${template}.mjml`, 'utf8')
		let hbTemplate = Handlebars.compile(mjmlFile)
		let compiled = hbTemplate(content)
		
		return compiled
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