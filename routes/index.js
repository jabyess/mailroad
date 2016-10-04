var express = require('express'),
router = express.Router();

router.get('/', function(req, res, next) {
  console.log('connected on /');
  // middleware();

  // Mongo.connect('mongodb://localhost:27017/emailbuilder', function(err, db) {
  //   assert.equal(null, err);
  //   console.log('connected to server');
  //   insertDocument(db, function() {
  //     db.close();
  //   });
  //
  // });

  res.render('index', {});

});

router.get('/email', (req, res, next) => {
  console.log('fired /email');

  res.render('email', {});
});


module.exports = router;
