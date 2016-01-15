var routes = require('require-directory')(module);

module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key !== 'index') {
      app.use('/' + key, routes[key]);
    }
  });

  app.get('/', function(req, res) {
    res.json({ 'version': '1.0' });
  });

};
