'use strict'

/* many of these ideas stolen from create-react-app */

const path = require('path')
const fs = require('fs')
const url = require('url')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = (relativePath) => {
	return path.resolve(appDirectory, relativePath)
}

module.exports = {
	appRoot: resolveApp('client'),
	appMainJSX: resolveApp('client/jsx/react-main.jsx'),
	appIndexJS: resolveApp('server/lib/index.js'),
	appIndexHTML: resolveApp('server/lib/index.html'),
	build: resolveApp('dist'),
	jsx: resolveApp('client/jsx'),
	sass: resolveApp('client/sass'),
	css: resolveApp('dist/base.css'),
}