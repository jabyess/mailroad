var path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
	app: path.join(__dirname, 'client'),
	build: path.join(__dirname, 'dist'),
	sass: path.join(__dirname, 'client/sass'),
	css: path.join(__dirname, 'dist/base.css')
}

module.exports = {
	context: PATHS.app,
	entry : {
		main: [path.join(__dirname, 'client/jsx/react-main.jsx')],
	},
	output: {
		path: PATHS.build,
		publicPath: 'http://localhost:3000/scripts/',
		filename: 'react-[name].js'
	},
	devServer: {
		port: 8888,
		proxy: {
			'/': 'http://localhost:3000'
		}
	},
	module: {
		rules: [
			{
				test : /(\.scss|\.sass)/,
				include: [PATHS.sass, 'bulma'],
				enforce: 'pre',
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
					// {	
					// 	loader: 'sass-loader',
					// 	includePaths: 'bulma'
					// }
				],
			},
			{
				test: /\.jsx?$/,
				// include: path.resolve(__dirname, 'client/jsx/'),
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [ ['es2015', { modules: false } ], 'react' ],
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
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader',
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin(PATHS.css)
	],
	watchOptions: {
		ignored: /node_modules/	
	}
}
