const paths = require('./paths')
const Dotenv = require('dotenv-webpack')

const config = {
	resolve: {
		extensions: ['.js', '.jsx']
	},
	entry : {
		main: [
			paths.appMainJSX
		]
	},
	output: {
		path: paths.build,
		publicPath: '/public/',
		filename: 'react-[name].js'
	},
	devServer: {
		port: 8888,
		contentBase: paths.build,
		publicPath: '/public/',
		proxy: {
			'/': 'http://localhost:33224',
		}
	},
	devtool: 'cheap-eval-source-map',
	module: {
		rules: [
			{
				test : /(\.scss|\.sass)/,
				include: paths.sass,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
			{
				test: /(\.jsx|\.js)/,
				include: paths.jsx,
				exclude: [/node_modules/, /couchdb-views/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: [['es2015', { 'modules': false } ], 'react' ],
						}
					}
				]
			},
			{
				test: /\.woff$/,
				use: [
					{
						loader: 'url-loader', 
						options: {
							limit: 50000
						}
					}
				]
			},
		]
	},
	plugins: [
		new Dotenv({
			path: './.env',
			safe: true
		})
	],
	watchOptions: {
		ignored: /node_modules/	
	}
}

module.exports = config