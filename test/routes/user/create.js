var fixtures = require('../../load_fixtures');
var user = fixtures.user;

describe('POST /user/reg', function() {
  context('POST /user/reg ', function() {
    it('should return 400', function(done) {
      http.post('/user/reg')
      .expect(400, function(err, result){
          result.body.should.have.property('errcode', 4010201);
          done();
      });
    });
  });
  context('POST /user/reg', function() {
      it('should return 200, errcode 0', function(done) {
        http.post('/user/reg')
        .send({
          'name' : user[1].name+'bak',
          'password' : user[1].password,
          'email' : user[1].email+'a'
        })
        .expect(200, function(err, result) {
          result.body.should.have.property('errcode', 0);
          result.body.data.should.have.property('name', user[1].name+'bak');
          result.body.data.should.have.property('email', user[1].email+'a');
          done();
        });
    });
  });
  context('POST /user/reg', function() {
      it('should return 400, errcode 4010203', function(done) {
        http.post('/user/reg')
        .send({
          'name' : user[1].name+'bak',
          'password' : user[1].password,
          'email' : user[1].email
        })
        .expect(400, function(err, result) {
          result.body.should.have.property('errcode', 4010203);
          done();
        });
    });
  });
});
