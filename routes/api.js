import express from 'express';
import { db } from '../db/db.js';
let router = express.Router()

router.post('/createEmail', (req, res, next) => {
	console.log(req);
	db();

	res.body = 'posted to createEmail';

	next();
})

export { router as API }