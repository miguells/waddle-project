var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var configdb = require('./configuration.js');

// mongodb connection

mongoose.connect("mongodb://" + configdb.username + ":" + configdb.password + "@ds113938.mlab.com:13938/" + configdb.name);
var db = mongoose.connection;
// mongo error
db.on('error',console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use sessions for tracking logins
app.use(session({
  secret: 'frase secreta',
  resave: true,
  saveUninitialized: false
}));

// routes
var routes = require('./routes');
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  console.log('Error')
  res.status(err.status || 500);
  res.json({error: err.message})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

