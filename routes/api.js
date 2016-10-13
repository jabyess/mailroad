import express from 'express';
import db from '../models/index.js';
import fs from 'fs';
import util from 'util';
import bodyParser from 'body-parser';

let router = express.Router()
let jsonParser = bodyParser.json();

router.post('/createEmail', jsonParser, (req, res, next) => {
	console.log(req.body);
	// let data = '';
	// req.setEncoding('utf8');
	// req.on('data', (chunk)=>{
	// 	data += chunk;
	// });
	// console.log(res.body);
	// req.on('end', ()=> {
	// 	req.body = data;
	// 	res.send(req.body);
	// });
	// console.log(req.query);
	// console.log(req.params);
	// console.log(req.route);
	// console.log(req.route.stack);

	// db.email.upsert({
	// 	email_content: req.body.email_content
	// });

	res.body = 'received yer post';
	res.send(res.body);

	next();
})

export { router as API }