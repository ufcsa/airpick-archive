'use strict';

/**
 * Module dependencies
 */
var requests = require('../controllers/pickreq.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/requests').all(requests.getUserInfo)
    .get(requests.list);

  app.route('/api/requests/:username')
    .get(requests.read)
    .post(requests.create)
    .put(requests.update);

  // Finish by binding the article middleware
  app.param('username', requests.requestUserId);
};
