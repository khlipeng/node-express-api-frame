var loadUserFromHeader = function(req, callback) {
  if (req.headers['x-session-id']) {
    req.sessionStore.get(req.headers['x-session-id'], function(err, session) {
      if (err || ! session) {
        return callback();
      }
      User.findById(session.uid, callback);
    });
  } else {
    callback();
  }
};

  var loadUserFromBasicAuth = function(req, callback) {
  var parseBasicAuth = function(authorization) {
    if (!authorization) {
      return;
    }
    var parts = authorization.split(' ');
    if (parts.length !== 2) {
      return;
    }
    var _credentials = new Buffer(parts[1], 'base64').toString().split(':');
    var email = _credentials[0];
    _credentials.splice(0, 1);
    return {
      email: email,
      password: _credentials.length > 1 ? _credentials.join(':') : _credentials[0]
    };
  };
  var auth = parseBasicAuth(req.headers.authorization);
  if (auth) {
    User.findOne({ email: auth.email.toLowerCase() }).exec(function(err, user) {
      if (!user) {
        return callback();
      }
      user.comparePassword(auth.password, function(err, result) {
        if (!result) {
          return callback();
        }
        callback(null, user);
      });
    });
  } else {
    callback();
  }
};

module.exports = function() {
  return function(req, res, next) {
    loadUserFromHeader(req, function(err, user) {
      if (user) {
        return next(null, user);
      }
      loadUserFromBasicAuth(req, next);
    });
  };
};
