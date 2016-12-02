import handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'
import juice from 'juice'

let defaultJuiceOptions = {
	preserveImportant: true,
	preserveMediaQueries: false,
	

}

export default class Utils {

	/** 
	 * Compiles handlebars template from source file with context passed in
	 * @static 
	 * @returns string
	 * @param {object} context - handlebars context to pass through.
	 * @param {string} context.title - title of the email
	 * @param {string} context.templateName - name of template to find and compile
	 * @param {array} context.emailContent - contents of the email
	 * @param {function} callback - callback function. takes compiled results as parameter
	 *  
	 */
	static getCompiledHandlebarsTemplate(context, callback) {
		fs.readFile(`./templates/${context.template}.hbs`, 'utf8', (err, data) => {
			let compiledSource = handlebars.compile(data)
			let compiledTemplate = compiledSource(context)
			callback(compiledTemplate)
		})
	}

	/** 
	 * Inlines CSS using Juice 
	 * @static
	 * @returns string 
	 * @param {string} compiledTemplate - email contents, already compiled via handlebars
	 */

	static inlineEmailCSS(compiledTemplate) {
		let inlinedTemplate = juice(compiledTemplate, defaultJuiceOptions)
		return inlinedTemplate
	}

}