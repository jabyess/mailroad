var Mongo = require('mongodb').MongoClient,
  // ObjectId = require('mongodb').ObjectId,
  // assert = require('assert'),

  path = require('path'),
  express = require('express'),
  hbs = require('express-handlebars'),
  logger = require('morgan');

var routes = require('./routes/index');
var middleware = require('./middleware');

var app = express();

app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use('/components', express.static(path.join(__dirname, '/src/components')));
app.use('/scripts', express.static(path.join(__dirname, 'dist')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
