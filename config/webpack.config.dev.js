const webpack = require('webpack')
const DotenvPlugin = require('webpack-dotenv-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const paths = require('./paths')

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
			'/': 'http://localhost:3000',
		}
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test : /(\.scss|\.sass)/,
				include: paths.sass,
				enforce: 'pre',
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
							plugins: ['react-hot-loader/babel']
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
		// new ExtractTextPlugin(paths.css),
		// new webpack.NamedModulesPlugin(),
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