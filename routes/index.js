import express from 'express'

let router = express.Router();

router.get('/', (req, res, next) => {
  console.log('connected on /')

  res.render('index', {})

});

export { router as routes }