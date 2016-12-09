import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import hbs from 'express-handlebars'
import { API } from './routes/api.js'
import db from './models/index.js'
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
	res.sendFile(path.join(__dirname, 'index.html'), {}, (err) => {
		if(err) {
			console.log("err ", err);
		}
	})
})


// use this to force:true to make db drop all tables and reset schema
// use when making schema changes
// db.sequelize.sync({force: true}).then(() => {
// 	app.listen(3000, function() {
// 		console.log('Listening on port 3000!');
// 	});
// })

db.sequelize.sync().then(() => {
	app.listen(3000, function() {
		console.log('Listening on port 3000!');
	});
})