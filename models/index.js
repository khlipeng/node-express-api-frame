var models = require('require-directory')(module);
var mongoose = require('mongoose');
var config = require('config');
var lingo = require('lingo');

var DB = mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.database);
var LogDB = mongoose.createConnection('mongodb://' + config.logMongodb.host + '/' + config.logMongodb.database);

var self = module.exports = {};

Object.keys(models).forEach(function(key) {
  if (key !== 'index') {
    var modelName = lingo.capitalize(key);
    if (modelName === 'Log') {
      self[modelName] = LogDB.model(modelName, models[key]);
    } else {
      self[modelName] = DB.model(modelName, models[key]);
    }
  }
});

self.DB = mongoose;