# 使用 Express 搭建 RestFUll API
## 使用流程
### 1. 下载代码
* 命令 : `git clone https://github.com/khlipeng/node-express-api-frame.git`

### 2. 安装 node.js 的包
* 命令 : `npm install` 

### 3. 运行测试
* 命令 : `npm test`

### 4. 运行
* 命令 : `npm start`

## 注意事项：
##### `ejs` 为需使用模板引擎，如果不需要使用模板引擎，可将 `app.js` 中的下列代码注释：

> var ejs = require('ejs');
>
> app.engine('.html', ejs.__express);
>
> app.set('view engine', 'html');

##### `express-validator` 为认证插件
* wiki : `https://github.com/ctavan/express-validator/blob/master/README.md`

##### `mocha` 为自动化测试工具
* wiki : `https://github.com/mochajs/mocha/wiki`
