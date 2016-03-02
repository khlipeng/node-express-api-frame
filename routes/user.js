var express = require('express');
var app = module.exports = express();
// var async = require('async');


app.param('userId', function(req, res, next, id) {
  User.findOne({
    _id: id
  }, function(err, user){
    req.user = user;
    next();
  });
});

/*
 * 注册会员
 * @Params {String} name 用户名
 * @Params {String} password 密码
 * @Params {String} email 邮箱
 */

app.post('/reg', function(req, res) {
  req.checkBody('name', {errcode: 4010201, errmsg: 'Name is required'}).notEmpty();
  req.checkBody('password', {errcode: 4010201, errmsg: 'Password is required'}).notEmpty();
  req.checkBody('email', {errcode: 4010201, errmsg: 'Email is required'}).notEmpty();

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
  req.checkBody('name', {errcode: -1, errmsg: 'Name is required'}).notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors[0]['msg']);
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
 * 用户登录
 * @Params {String} email 邮箱
 * @Params {String} password 密码
 */
app.post('/login', function(req, res) {
  delete req.session.uid;

  if (req.body && req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, function(err, user) {
      if (err) {
        return res.status(401).json({
          errcode: 4010001,
          errmsg: err
        }); 
      }

      if(!user) {
        return res.status(401).json({
          errcode: 4030210,
          errmsg: 'Email not exist'
        });
      }

      user.comparePassword(req.body.password, function(err, result) {
        if (err) {
          return res.status(401).json({
            errcode: 4010001,
            errmsg: err
          }); 
        }
        if (!result) {
          return res.status(401).json({
            errcode: 4030211,
            errmsg: 'Wrong email or password'
          });
        }

        req.session.uid = user.id;
        if (req.body.remember) {
          req.session.cookie.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
        user = user.toJSON();
        user.sessionID = req.sessionID;
        res.json({
          errcode: 0,
          data: user
        });
      });

    });
  } else {
    res.status(401).json({
      errcode: 4030211,
      errmsg: 'Wrong email or password'
    });
  }
});
/*
 * 查看个人信息
 */
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

  req.checkBody('oldpassword', {errcode: 4010201, errmsg: 'oldpassword is required'}).notEmpty();
  req.checkBody('newpassword', {errcode: 4010201, errmsg: 'newpassword is required'}).notEmpty();
  req.checkBody('repassword', {errcode: 4010201, errmsg: 'repassword is required'}).notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json(errors[0]['msg']);
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

/*
 * 登出接口
 */
app.delete('/', function(req, res) {
  delete req.session.uid;
  res.json({
    errcode: 0,
    data: {}
  });
});
