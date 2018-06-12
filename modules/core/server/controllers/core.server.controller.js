'use strict';

var validator = require('validator'),
  path = require('path'),
  http = require('http'),
  CronJob = require('cron').CronJob,
  config = require(path.resolve('./config/config'));


/**
 * This is a hit cron job that keeps itself awake at Heroku
 */
var hitService = new CronJob('0 */15 * * * *', function () {
  let options = {
    host: 'www.uflcsa.org',
    path: '/empty'
  };
  http.get(options, function (res) {
    console.log('Just hit myself: ' + res.statusCode);
  });
}, null, true, 'America/Los_Angeles');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      wechatid: validator.escape(req.user.wechatid),
      phone: validator.escape(req.user.phone),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
