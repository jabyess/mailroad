import handlebars from 'handlebars'
import fs from 'fs'
import juice from 'juice'
import moment from 'moment'
import path from 'path'

let defaultJuiceOptions = {
	preserveImportant: true,
	preserveMediaQueries: false,
}

class Utils {

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


	/**
	 * Compares each value, in order, of two arrays. Used mostly to compare old/new state.
	 * @static
	 * @returns boolean
	 * @param {array} arrayOne - an array of primitive values.
	 * @param {array} arrayTwo - an array of primitive values.
	 */
	static arrayEquals(arrayOne, arrayTwo) {

		if(arrayOne.length !== arrayTwo.length) {
			return false
		}

		arrayOne.forEach((value, index) => {
			if(value !== arrayTwo[index]) {
				return false
			}
			else return true
		})
	} 

	static formatS3Filename(filename, width, height, random) {
		const now = moment().format('YYYYMMDDHHmmss')
		const ext = path.extname(filename)
		const prefix = filename.split('.')[0]
		const formattedFilename = width + 'x' + height + '-' + random + now + '-' + prefix + ext
		return formattedFilename
	}

	static cleanupTempDir(tempFolderPath) {
		fs.rmdirSync(tempFolderPath)
		console.log('removed temp dir')
	}

	static getCurrentTimestampUTC() {
		// let offset = moment().utcOffset()
		return moment.utc().format()
	}

}

export default Utils