// exports = module.exports = function() {
//
//   app.get('/', function(req, res) {
//     console.log('connected on /');
//     middleware();
//
//     Mongo.connect('mongodb://localhost:27017/emailbuilder', function(err, db) {
//       assert.equal(null, err);
//       console.log('connected to server');
//       insertDocument(db, function() {
//         db.close();
//       });
//
//     });
//
//     res.send('inserted document, yay');
//
//   })
//
// }
