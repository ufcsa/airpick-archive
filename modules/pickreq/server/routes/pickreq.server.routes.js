'use strict';

/**
 * Module dependencies
 */
var requests = require('../controllers/pickreq.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/requests')
    .get(requests.list);

  // Single article routes
  app.route('/api/requests/:userId')
    .get(requests.read)
    .post(requests.create)
    .put(requests.update);

  // Finish by binding the article middleware
  app.param('userId', requests.requestUserId, requests.getUserInfo);
};
