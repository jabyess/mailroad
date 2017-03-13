var path = require('path')
const webpack = require('webpack')
const DotenvPlugin = require('webpack-dotenv-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
	app: path.join(__dirname, 'client'),
	build: path.join(__dirname, 'dist'),
	jsx: path.join(__dirname, 'client/jsx'),
	sass: path.join(__dirname, 'client/sass'),
	css: path.join(__dirname, 'dist/base.css'),
	static: 'http://localhost:3000/static/'
}

const config = {
	context: PATHS.app,
	entry : {
		main: [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://localhost:8888',
			'webpack/hot/only-dev-server',
			path.join(__dirname, 'client/jsx/react-main.jsx'),
		]
	},
	output: {
		path: PATHS.build,
		publicPath: PATHS.static,
		filename: 'react-[name].js'
	},
	devServer: {
		hot: true,
		port: 8888,
		proxy: {
			'/': 'http://localhost:3000',
			'/static': 'http://localhost:3000/static/'
		}
	},
	module: {
		rules: [
			{
				test : /(\.scss|\.sass)/,
				include: PATHS.sass,
				enforce: 'pre',
				use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
			{
				test: /\.jsx?$/,
				include: PATHS.jsx,
				exclude: [/node_modules/, /couchdb-views/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [ ['es2015', { 'modules': false } ], 'react' ],
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
		new ExtractTextPlugin(PATHS.css),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		// new webpack.DefinePlugin({
		// 	'process.env': {
		// 		'NODE_ENV': 'development'
		// 	}
		// })
		new DotenvPlugin({
			sample: './.env.sample',
			path: './.env'
		})
	],
	watchOptions: {
		ignored: /node_modules/	
	}
}

module.exports = config