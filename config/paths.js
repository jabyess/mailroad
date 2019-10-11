const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = (relativePath) => {
	return path.resolve(appDirectory, relativePath)
}

module.exports = {
	appIndexJS: resolveApp('server/lib/index.js'),
	appIndexHTML: resolveApp('server/lib/index.html'),
	build: resolveApp('dist'),
	public: resolveApp('public'),
	mjml: resolveApp('mjml-templates')
}