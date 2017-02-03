import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import hbs from 'express-handlebars'
import { API } from '../routes/api.js'
import axios from 'axios'
import fs from 'fs'
import webpackDevMiddleware from 'webpack-dev-middleware'


dotenv.config();

let app = express();

app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/scripts', express.static(path.join(__dirname, 'dist')));
app.use('/api', API);


app.get('/editor/*', (req, res) => {
	res.redirect('/')
})

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../../index.html'), {}, (err) => {
		if(err) {
			console.log("err ", err);
		}
	})
})

// on startup, should check to see if database connection is good.
// if so, make sure all couchdb-views are in the system by making http requests against them
// if so, start db
// if not, create them then start db
axios.get('http://127.0.0.1:5984')
	.then((response) => {
		if(response && response.data) {
			let viewPath = path.resolve(__dirname, '../couchdb-views')
			fs.readdir(viewPath, (err, files)=>{
				console.log(files)
				axios.get('http://127.0.0.1:5984/_uuids', {
					count: files.length
				}).then(() => {
					let responses = files.map((file, index) => {
						let parsedName = file.split('.')[0]
						let url = `http://127.0.0.1:5984/emailbuilder/_design/${parsedName}`
						return axios.get(url)
					})
					axios.all(responses)
					.then(axios.spread((...responses) => {
						console.log('made',responses.length, 'requests')
						// console.log(arguments)
						// finish logic to sync views to db
						app.listen(3000, () => {
							console.log('Express listening on port 3000!')
						})
					}))
					
				})
				.catch((err)=>{
					console.log(err)
					throw err
				})
			})
		}
		else {
			throw new Error('Could not connect to couchDB. Please check your config.')
		}
	})
	.catch((err) => {
		console.log(err)
		throw new err
	})

