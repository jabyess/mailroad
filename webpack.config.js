var path = require('path');


const PATHS = {
	app: path.join(__dirname, 'client'),
	build: path.join(__dirname, 'dist'),
	sass: path.join(__dirname, 'client/sass')
}

module.exports = {
	entry : {
		main: ['whatwg-fetch', path.join(__dirname, 'client/react-main.jsx')],
	},
	output: {
		path: PATHS.build,
		publicPath: 'http://localhost:3000/scripts/',
		filename: 'react-[name].js'
	},
	devServer: {
		port: 8888,
		proxy: {
			"/": "http://localhost:3000"
		}
	},
	module: {
		loaders: [
			{
				test : /(\.scss|\.sass)/,
				loaders: ['style','css','sass'],
			},
			{
				test: /\.woff$/,
				loader: 'url-loader',
				options: {
					limit: 50000
				}
			},
			{
				test: /\.json/, loader: "json-loader"
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
	},
	watchOptions: {
		ignored: /node_modules/	
	}
}
