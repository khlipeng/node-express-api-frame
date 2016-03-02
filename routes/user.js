var express = require('express');
var app = module.exports = express();
// var async = require('async');


// var User = require('../models/user');

app.param('userId', function(req, res, next, id) {
  User.findOne({
    _id: id
  }, function(err, user){
    req.user = user;
    next();
  });
});



app.post('/', function(req, res) {
  req.checkBody('name', {errcode: -1, errmsg: 'Name is required'}).notEmpty();
  req.checkBody('password', {errcode: -1, errmsg: 'Password is required'}).notEmpty();
  req.checkBody('email', {errcode: -1, errmsg: 'Email is required'}).notEmpty();


  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors[0]['msg']);
  }


  var newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });
  newUser.save(function(err, user) {
    if (err) {
      return res.status(409).json({
        errcode: 4010203,
        errmsg: 'Email is occupied'
      });
    }

    var code = {
      type: 'activate',
      email: user.email
    };

    req.session.uid = user.id;
    user = user.toJSON();
    user.sessionID = req.sessionID;

    res.json({
      errcode: 0,
      data: user
    });   
     
  });
});

/*
 * 检测用户名是否已存在
 * @Params {String} name 用于检测的用户名
 */
app.post('/check_name', function(req, res){

  var errors = [];
  req.onValidationError(function(msg) {
      errors.push(msg);
  });

  req.checkBody('name', { errcode: 4010201, errmsg: 'Invalid name'}).isValidName();

  if(errors.length) {
    return res.status(400).json(errors[0]);
  }

  User.findOne({
    name: req.body.name
  }).exec(function(err, user){
    if(err) {
      return res.status(400).json({
        errcode: 4010202,
        errmsg: err
      });
    }

    if(user) {
      return res.status(400).json({
        errcode: 4010205,
        errmsg: 'Name is occupied'});
    }

    return res.json({
      errcode: 0,
      errmsg: 'Success.'
    });
  });
});


/*
 * 修改密码
 * @param {String} oldpassword 老密码
 * @param {String} newpassword 新密码
 * @param {String} repassword 确认密码
 */
app.put('/password', function(user, req, res){
  if (!user) {
    return res.status(401).json({
      errcode: -2,
      errmsg: 'No permission'
    });
  }

  var errors = [];
  req.onValidationError(function(msg) {
    errors.push(msg);
  });

  req.checkBody('oldpassword', {errcode: 4010201, errmsg: 'Old password short'}).len(6, 20);
  req.checkBody('newpassword', {errcode: 4010201, errmsg: 'New password short'}).len(6, 20);
  req.checkBody('repassword', {errcode: 4010201, errmsg: 'Confirmation password should equal newpassword'}).equals(req.body.newpassword);

  if (errors.length) {
    return res.status(400).json(errors[0]);
  }

  User.findOne({
    email: user.email
  }, function(err, user) {
    if(!user) {
      return res.status(400).json({
        errcode: 4010202,
        errmsg: 'User not Found'
      });
    }

    user.comparePassword(req.body.oldpassword, function(err, result) {
      if (err || !result) {
        return res.status(400).json({
          errcode: 4010206,
          errmsg: 'Old password invalid'
        });
      }

      user.password = req.body.newpassword;
      user.save(function(err, user) {
        if(err) {
          return res.status(400).json({
            errcode: 4010203,
            errmsg: err
          });
        }

        return res.status(200).json({
          errcode: 0,
          data: user
        });
      });
    });
  });
});

app.get('/me', function(user, req, res) {
  if (!user) {
    return res.status(401).json({
      errcode: -2,
      errmsg: 'No permission'
    });
  }

  res.json({
    errcode: 0,
    data: user
  });
});

app.get('/me/members', function(user, req, res) {
  if (!user || (user.role !== 'admin' && user.role !== 'assistant')) {
    return res.status(401).json({
      errcode: -2,
      errmsg: 'No permission'
    });
  }

  var query = User.find({
    clients: user.clients
  });

  if (req.query.name) {
    query.and({
      name: {
        $regex: req.query.name
      }
    });
  }

  query.sort('-createdTime')
  .exec(function(err, users) {
    if(err) {
      return res.status(400).json({
        errcode: 4010001,
        errmsg: err
      });
    }

    res.json({
      errcode: 0,
      data: users
    });
  });
});

