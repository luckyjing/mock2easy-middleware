var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var mock2easyMiddleware = require('../index.js');
var devServerPort = config.devServer.port;
var mockPort = 8005; // mock服务启动的端口

config.entry.unshift("webpack/hot/dev-server", "webpack-hot-middleware/client?reload=true");
var app = express();
var compiler = webpack(config);
app.use(require("webpack-dev-middleware")(compiler, config.devServer));
app.use(require("webpack-hot-middleware")(compiler));
app.use(mock2easyMiddleware({
  port: mockPort
}));
app.listen(devServerPort, function () {
  console.log('开发环境已经启动: http://127.0.0.1:' + devServerPort);
});

