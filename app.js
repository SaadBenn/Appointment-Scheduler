var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
const api = require('./routes/api/index');

var app = express();

mongoose.Promise = global.Promise;

mongoose.connect('Saad Khan:rockstar0560@ds163382.mlab.com:63382/appointment-scheduler', {
	useMongoClient: true
});

// enable CORS, cross-origin resource sharing
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

	// set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
