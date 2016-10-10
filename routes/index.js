import express from 'express'

let router = express.Router();

router.get('/', (req, res, next) => {
  console.log('connected on /')

  res.render('index', {})

});

router.get('/email', (req, res, next) => {
  console.log('fired /email')

  res.render('email', {})
});

export { router as routes }