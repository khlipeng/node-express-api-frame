var fixtures = require('../../load_fixtures');
var demo = fixtures.demo[0];

describe('POST /demo/add', function() {
  context('POST /demo/add ', function() {
    it('should return 400', function(done) {
      http.post('/demo/add')
      .expect(400, function(err, result){
          result.body.should.have.property('errcode', -1);
          done();
      });
    });
  });

  context('POST /demo/add', function() {
      it('should return 200, errcode 0', function(done) {
        http.post('/demo/add')
        .send({
          'name' : demo.name,
          'sex' : demo.sex,
          'age' : demo.age,
          'email' : demo.email
        })
        .expect(200, function(err, result) {
          result.body.should.have.property('errcode', 0);
          result.body.data.should.have.property('name', demo.name);
          result.body.data.should.have.property('age', demo.age);
          result.body.data.should.have.property('sex', demo.sex == 1 ? '男' : '女');
          result.body.data.should.have.property('email', demo.email);
          done();
        });
    });
  });
});
