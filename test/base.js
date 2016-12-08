var mock2easyMiddleware = require('../index.js');
var express = require('express');
var server = express();
server.use("/", express.static(__dirname + "/public"));
server.use(mock2easyMiddleware());
server.use(function (req, res, next) {
  console.log('I\'m a middleware after mock2easy');
});
server.listen(3005, function () {
  console.log('前端服务器已经启动')
});