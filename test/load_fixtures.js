var path = require('path');
var fixtures = module.exports = require('require-directory')(module, path.join(__dirname, 'fixtures'));
/*
 * beforeEach   为测试前调用的钩子
 * afterEach    为结束后调用的钩子
 */
if (require.main === module) {
  require('../env');

} else {
  //
  // beforeEach();
  // afterEach();
}
