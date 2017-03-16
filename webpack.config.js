var path = require('path')
const DotenvPlugin = require('webpack-dotenv-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATHS = {
	app: path.join(__dirname, 'client'),
	build: path.join(__dirname, 'dist'),
	sass: path.join(__dirname, 'client/sass'),
	css: path.join(__dirname, 'dist/base.css'),
	bulma: path.resolve(__dirname, 'node_modules/bulma')
}

module.exports = {
	context: PATHS.app,
	resolve: {
		extensions: ['.js', '.jsx']
	},
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
				include: PATHS.sass,
				enforce: 'pre',
				use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
			{
				test: /\.jsx?$/,
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
		new ExtractTextPlugin(PATHS.css),
		new DotenvPlugin({
			sample: './.env.sample',
			path: './.env'
		})
	],
	watchOptions: {
		ignored: /node_modules/	
	}
}
