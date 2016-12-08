/**
 * mock2easy-middleware
 * Copyright(c) 2016 Lucky Jing
 * MIT Licensed
 */

/**
 * Module dependencies
 * @private
 */

var mock2easy = require('mock2easy');
var request = require('request');
/**
 * default config
 * @private
 */

var defaultConfig = {
  port: 8005,
  lazyLoadTime: 3000,
  database: 'mock2easy',
  doc: 'doc',
  ignoreField: [],
  interfaceSuffix: '.json',
  preferredLanguage: 'en'
};

/**
 * Module exports.
 */
module.exports = mock2easyMiddle;


function mock2easyMiddle(options) {
  if (!options) {
    options = defaultConfig;
  } else {
    options = Object.assign({}, defaultConfig, options);
  }
  mock2easy(options, function (app) {
    app.listen(options.port, function () {
      console.log(('mock2easy is starting , please visit : http://127.0.0.1:' + options.port).bold.cyan);
    });
  });
  var baseUrl = 'http://127.0.0.1:' + options.port;
  return function middleware(req, res, next) {
    // match api
    if (req.url.indexOf(options.interfaceSuffix)<0) {
      return next();
    }
    var requestParams = {
      uri: req.url,
      baseUrl: baseUrl,
      method: req.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    };
    request(requestParams, function (error, response, body) {
      if (error) {
        return next(error);
      }
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(body);
      next();
    });
  }
}
