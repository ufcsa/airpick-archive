'use strict';

/**
 * Module dependencies
 */
var requests = require('../controllers/pickreq.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/requests')
    .get(requests.list)
    .post(requests.create);

  // Single article routes
  app.route('/api/requests/:userId')
    .get(requests.read)
    .put(requests.update);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};
