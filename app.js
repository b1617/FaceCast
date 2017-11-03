var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/faceCast');
var mongoose = require('mongoose');
var model = require('./models/modelJson');


var index = require('./routes/index');
var offre = require('./routes/offre');
var ajout = require('./routes/ajout');
var candidature = require('./routes/candidature');
var restapi = require('./rest/rest.js');

//var update = require('./routes/update');




mongoose.connect('mongodb://localhost/faceCast');
var app = express();
app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){ req.db = db; next();});

app.use('/', index);
app.use('/offre', offre);
app.use('/ajout', ajout);
app.use('/candidature',candidature);
app.use('/rest', restapi);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
