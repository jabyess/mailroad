import { mjml2html } from 'mjml'
import path from 'path'
import Handlebars from 'handlebars'
import fs from 'fs'
import juice from 'juice'

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
	console.log('compiledHTML inside ', html)
	let options = opts || {}
	const inlined = juice(html)
	return inlined
}