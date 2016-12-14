# mock2easy-middleware

这是一个非常容易使用的前端`mock`服务器中间件，它可以很方便地接入到你的开发中。

## 安装

```sh
npm install mock2easy-middleware
```

当然，你可以使用淘宝镜像提供的`cnpm`加速下载过程

## 背景简介

前端开发过程中，避免不了需要从后端接口获取数据，例如后端同学给出了`/profile.json`的API时，我们前端代码里可能会写到：
```javascript
$.get('/profile.json').done(function(){
    // ...
})
```
但是是无法在浏览器里获取到数据的，而是直接报错。

我们的目标很简单，有一个能编写`mock`接口的服务，假设跑在`8005`端口下，前端静态资源被伺服在`3005`端口下，我们希望能够在增加了一个`mock`接口如`/profile.json`后，能够在`localhost:3005/profile.json`获取到数据。整体流程如图所示：

![](http://7xlqsb.com1.z0.glb.clouddn.com/mock.png)

`mock2easy-middleware`基于[mock2easy](https://github.com/appLhui/mock2easy)，它是一个`express`的中间件，能够在提供静态文件服务器服务的`express`基础上，增加了`mock`的功能。

## 开始使用

### 情景1：`express`作为静态资源服务器，想要增加`mock`服务

```javascript
var mock2easyMiddleware = require('mock2easy-middleware');
var express = require('express');
var server = express();
server.use("/", express.static(__dirname + "/public")); // 静态资源所在目录
server.use(mock2easyMiddleware());
server.use(function (req, res, next) {
  console.log('I\'m a middleware after mock2easy');
});
server.listen(3005, function () {
  console.log('前端服务器已经启动')
});
```

### 情景2:使用`middleware方式启动webpack-dev-server`

大家使用`webpack-dev-server`时，在命令行执行一句话`webpack-dev-server`即可跑起服务，但是我们是不能往其中植入`mock`服务的，所以我们使用了`express`搭配`webpack-dev-server-middleware`服务来手动实现一个`dev-server`，并且植入`mock`服务

```javascript
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev'); // 导入webpack.config.js文件
var mock2easyMiddleware = require('mock2easy-middleware');
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

```

使用方式不变，原先是直接在命令行执行`webpack-dev-server`，现在更改为执行`node dev.js`

### 情景3：不手动启动`webpack-dev-server`，直接融入现有`webpack.config.js`

这种情况下，便不需要使用本中间件了，直接使用`mock2easy`即可，步骤如下：

1.在`webpack.config.js`中加入`mockeasy`的配置&运行代码
```javascript
var mock2easy = require('mock2easy');

var defaultConfig = {
  port: 8005,
  lazyLoadTime: 3000,
  database: 'mock2easy',
  doc: 'doc',
  ignoreField: [],
  interfaceSuffix: '.json',
  preferredLanguage: 'en'
};

mock2easy(defaultConfig, function (app) {
  app.listen(defaultConfig.port, function () {
    console.log(('mock2easy is starting , please visit : http://127.0.0.1:' + defaultConfig.port).bold.cyan);
  });
});
```

2.在配置文件里的`devServer`字段增加如下内容
```javascript
  devServer: {
    proxy:{
      '/*.json':{
        target:'http://localhost:8005', // 8005 为mock服务所绑定的端口号
        secure:false
      }
    }
  },
```

## Demo

1.克隆本仓库

2.`npm install`

3.分别执行以下命令，体验不同`mock`融入方式

```sh
npm run dev # 前端资源使用express作为静态服务器
npm run dev1 # 手动实现webpack-dev-server
npm run dev2 # 不使用中间件，直接融入webpack.config.js
```

## 后续

1. 目前在对于接口命名的支持上，暂时只支持**以`.xxx`**（如`/profile.json`,`/profile.do`）作为后缀的接口，这样主要是为了方便区分静态资源接口和mock接口，下一步将对`RESTful`API提供支持
