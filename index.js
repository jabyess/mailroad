import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import hbs from 'express-handlebars';
import { routes } from './routes/index.js';
import { API } from './routes/api.js';
import db from './models/index.js';

dotenv.config();

let app = express();

app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/components', express.static(path.join(__dirname, '/src/components')));
app.use('/scripts', express.static(path.join(__dirname, 'dist')));
app.use('/', routes);
app.use('/api', API);

db.sequelize.sync().then(() => {
	app.listen(3000, function() {
		console.log('Listening on port 3000!');
	});
})


