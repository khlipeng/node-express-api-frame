var fixtures = require('../../load_fixtures');
var demo = fixtures.demo;

describe('GET /demo', function() {
  context('show /demo ', function() {
    it('should return 200', function(done) {
      http.get('/demo')
      .expect(200, done);
    });
  });

  context('show /demo/data', function() {
      it('should return 200, errcode 0', function(done) {
        http.get('/demo/data')
        .expect(200, function(err, result) {
          result.body.should.have.property('errcode', 0);
          done();
        });
    });
  });
});
