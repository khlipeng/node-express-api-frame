var env = GLOBAL.env = {};

if (process.env.NODE_ENV === 'test') {
  GLOBAL.http = require('supertest')(require('./app'));
}
