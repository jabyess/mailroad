import express from 'express'
import models from '../models/index.js';

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