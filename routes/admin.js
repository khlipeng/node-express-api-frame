var express = require('express');
var app = module.exports = express();

app.get('/', function(req, res) {
  return res.json({
    'errcode' : 0,
    'errmsg' : 'success.',
  });
});

app.get('/data', function(req, res){
  return res.json({
    'errcode' : 0,
    'errmsg' : 'success.',
  });
});
