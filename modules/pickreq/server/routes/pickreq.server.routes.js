'use strict';

/**
 * Module dependencies
 */
var requests = require('../controllers/pickreq.server.controller'),
  completed = require('../controllers/completed.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/requests')
    .get(requests.list);

  app.route('/api/roomreqs')
    .get(requests.listRm);

  app.route('/api/requests/:volunteer')
    .get(requests.listAccepted);

  app.route('/api/request/accept')
    .post(requests.accept);

  app.route('/api/request/:username')
    .get(requests.read)
    .put(requests.update);

  app.route('/api/requests/completed/:user')
    .get(completed.listCompleted);

  // Finish by binding the article middleware
  app.param('username', requests.requestUserId);
  app.param('volunteer', requests.getAccepted);
  app.param('user', completed.getCompleted);
};
