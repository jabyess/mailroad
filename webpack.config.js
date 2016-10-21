var path = require('path');


const PATHS = {
	app: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'dist'),
	sass: path.join(__dirname, 'src/sass')
}

module.exports = {
	entry : {
		main: path.join(__dirname, 'src/react-main.jsx'),
		emails: ['whatwg-fetch', path.join(__dirname, 'src/react-emails.jsx')], 
	},
	output: {
		path: PATHS.build,
		filename: 'react-[name].js'
	},
	module: {
		loaders: [
			{
				test : /\.sass/,
				loaders: ['style','css','sass'],
			},
			{
				test: /\.jsx?$/,
				include: PATHS.app,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: [ 'es2015', 'react' ],
					cacheDirectory: true
				}
			},
			{
				test: /\.handlebars$/,
				loader: 'handlebars-loader'
			}
		]

	}
}
