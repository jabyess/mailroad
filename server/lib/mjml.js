const mjml2html = require('mjml')
const path = require('path')
const Handlebars = require('handlebars')
const fs = require('fs')
const juice = require('juice')

const compileToMJML = module.exports.compileToMJML = (html) => {
	const output = mjml2html(html)
	return output
	// return html
}

const parseHandlebars = module.exports.parseHandlebars = (content, template, callback) => {
	fs.readFile(path.join(__dirname, `../mjml-templates/${template}.mjml` ), 'utf8', (err, file) => {
		if(err) {
			console.log(err)
			return
		}
		if(!err) {
			// console.log(content)
			let compiled = Handlebars.compile(file)
			let result = compiled(content)
			callback(result)
		}
	})
}

const inlineCSS = module.exports.inlineCSS = (html, opts) => {
	const defaultOptions = {
		inlinePseudoElements: false,
		preserveImportant: true
	}

	console.log('compiledHTML inside ', html)

	let options = Object.assign({}, opts, defaultOptions)
	const inlined = juice(html, options)

	return inlined
}