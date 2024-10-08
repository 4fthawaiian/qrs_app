var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const axios = require('axios');
const cors = require('cors');

const { OAuth2Client } = require('google-auth-library');
const oauth2Client = new OAuth2Client();

var indexRouter = require('./routes/index');

var app = express();
app.use(cors());
/* ======= */
require('./passport');
const cookieSession = require("cookie-session");
const passport = require("passport");

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());
/* ====== */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.us*(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
