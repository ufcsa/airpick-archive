'use strict';

/**
 * Module dependencies
 */
var requests = require('../controllers/pickreq.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/requests')
    .get(requests.list);

  app.route('/api/request/accept')
    .post(requests.accept);

  app.route('/api/request/:username')
    .get(requests.read)
    .post(requests.create)
    .put(requests.update);

  // Finish by binding the article middleware
  app.param('username', requests.requestUserId);
};
