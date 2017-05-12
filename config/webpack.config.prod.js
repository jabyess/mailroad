const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const paths = require('./paths')


const config = {
	resolve: {
		extensions: ['.js', '.jsx']
	},
	entry : {
		main: [ paths.appMainJSX ]
	},
	output: {
		path: paths.build,
		publicPath: paths.appRoot,
		filename: 'react-[name].js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test : /(\.scss|\.sass)/,
				include: paths.sass,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						}, 
						'sass-loader'
					],
				})
			},
			{
				test: /(\.jsx|\.js)/,
				include: paths.appRoot,
				exclude: [/node_modules/, /couchdb-views/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: false,
							presets: [ ['es2015', { modules: false }], 'react' ]
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
		new ExtractTextPlugin('styles.css'),
		new CompressionPlugin({
			test: /\.js$/,
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: 'source-map'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.NamedModulesPlugin(),
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