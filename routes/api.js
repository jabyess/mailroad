import express from 'express'
let router = express.Router()


router.post('/v1/createEmail/', (req, res, next) => {

	res.body = 'posted to createEmail';

	next();


})

export { router as API }