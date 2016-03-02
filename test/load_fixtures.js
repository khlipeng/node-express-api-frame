var async = require('async');
var path = require('path');
var lingo = require('lingo');

var fixtures = module.exports = require('require-directory')(module, path.join(__dirname, 'fixtures'));
/*
 * beforeEach   为测试前调用的钩子
 * afterEach    为结束后调用的钩子
 */

//暂时注释
// var load = function(done) {
//   async.each(Object.keys(fixtures), function(key, callback) {
// 	var moduleName = lingo.capitalize(key);
// 	GLOBAL[moduleName].create(fixtures[key], callback);
//   }, done);
// };

// var clear = function(deepClean, done) {
//   if (typeof deepClean === 'function') {
//     done = deepClean;
//     deepClean = null;
//   }
//   if (deepClean === true) {
//     return DB.connection.db.dropDatabase(done);
//   }

//   async.each(Object.keys(fixtures), function(key, callback) {
//     var modelName = lingo.capitalize(key);
//     GLOBAL[modelName].remove(callback);
//   }, done);
// };

var clear = function(done){
    return DB.connection.db.dropDatabase(done);

}

if (require.main === module) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Cannot load test data in the production env.');
    process.exit(1);
  }
  require('../env');

  setTimeout(function() {
    console.log('Clearing database...');
    clear(true, function() {
      console.log('Loading database...');
      load(function() {
        console.log('Done!');
        process.exit(0);
      });
    });
  }, 500);

} else {
  // beforeEach();
  // afterEach();
  	// beforeEach(load);
  	afterEach(clear);


}


