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


app.post('/add', function(req, res){


  req.checkBody('name', {errcode: -1, errmsg: 'Name is required'}).notEmpty();
  req.checkBody('sex', {errcode: -1, errmsg: 'Sex is required'}).notEmpty();
  req.checkBody('sex', {errcode: -1, errmsg: 'Sex is Int'}).isInt();
  req.checkBody('age', {errcode: -1, errmsg: 'age is required'}).notEmpty();
  req.checkBody('age', {errcode: -1, errmsg: 'age is Int'}).isInt();
  req.checkBody('email', {errcode: -1, errmsg: 'email is required'}).notEmpty();
  req.checkBody('email', {errcode: -1, errmsg: 'email is Email'}).isEmail();


  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors[0]['msg']);
  }

  return res.json({
    'errcode' : 0,
    'errmsg' : 'success.',
    'data' : {
      'name' : req.body.name,
      'sex' : req.body.sex == 1 ? '男' : '女',
      'age' : req.body.age,
      'email' : req.body.email
    }
  });
});
