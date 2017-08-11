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

	/**
	 * Converts MJML markup to proper HTML
	 * @param {string} html 
	 * @return {string}
	 */
	compileToHTML(html) {
		let output = mjml.mjml2html(html)
		return output
	}

	/**
	 * 
	 * @param {object} content - Handlebars context object for the template
	 * @param {string} template - Name of the template to compile with handlebars
	 * @return {object}
	 */
	parseHandlebars(content, template) {
		let mjmlFile = fs.readFileSync(`${paths.mjml}/${template}.mjml`, 'utf8')
		let hbTemplate = Handlebars.compile(mjmlFile)
		let compiled = hbTemplate(content)
		
		return compiled
	}

	/**
	 * 
	 * @param {string} html 
	 * @param {object} opts 
	 */
	inlineCSS(html, opts) {
		const defaultOptions = {
			inlinePseudoElements: false,
			preserveImportant: true
		}

		let options = Object.assign({}, opts, defaultOptions)
		const inlined = juice(html, options)

		return inlined
	}

	/**
	 * Runs all 3 compilation functions and returns the result.
	 * @param {object} content - Handlebars context object for the template
	 * @param {string} template - Name of the template to compile with handlebars
	 */
	compileAll(content, template) {
		let hb = this.parseHandlebars(content, template)
		let rawHtml = this.compileToHTML(hb)
		let inlinedHtml
		if(rawHtml.errors.length < 1) {
			inlinedHtml = this.inlineCSS(rawHtml.html)
		}
		else {
			throw rawHtml.errors
		}

		return inlinedHtml
	}
}

module.exports = MJML