const router = require('express').Router()

router.use('/api/email', require('./api.js'))
router.use('/api/s3', require('./s3.js'))
router.use('/api/meta', require('./meta.js'))

module.exports = router
