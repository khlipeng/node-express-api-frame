// require('./env');
require('express-di');
// var config = require('config');

var express = require('express');
var app = module.exports = express();

app.use(require('morgan')('dev'));

app.use(require('cookie-parser')());


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

require('./factories')(app);
require('./routes')(app);
require('./models');


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.code = 404
  next(err);
});

/* jshint unused:false */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      env: 'development',
      errcode: err.code,
      errmsg: err.message
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errcode: err.code,
    errmsg: err.message,
    error: {}
  });
});

if (app.get('env') === 'test') {
  app.listen(process.env.PORT || 3000);
}
