require('./env');
require('express-di');
var express = require('express');
var app = module.exports = express();

var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
// var multer  = require('multer');
var ejs = require('ejs');
var config = require('config');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(expressValidator({
 customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    },
    gte: function(param, num) {
        return param >= num;
    }
 }
}));

app.use(require('morgan')('dev'));
app.use(require('cookie-parser')());

var session    = require('express-session');
var RedisStore = require('connect-redis')(session);
//client: Redis, 
app.set('sessionStore',  new RedisStore({ host: config.redis.host, port: config.redis.port }));
app.use(session({
  secret: config.sessionSecret,
  store: app.get('sessionStore'),
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

require('./factories')(app);
require('./routes')(app);
require('./models');


// app.engine('.html', ejs.__express);
// app.set('view engine', 'html');

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

if (app.get('env') !== 'test') {
  app.listen(process.env.PORT || 3000);
}
