'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  adminAction = require('../controllers/adminAction.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/admin/orientation/email')
    .post(adminAction.orientationEmail);

  app.route('/api/admin/csainterview/email')
    .post(adminAction.csaInterviewEmail);

  app.route('/api/admin/interview-result')
    .post(adminAction.csaInterviewResults);

  app.route('/api/admin/bestsinger')
    .post(adminAction.csaBestSingerRegistered);

  app.route('/api/admin/bestsingertop16')
    .post(adminAction.csaBestSingerTop16);

  app.route('/api/admin/group-activity')
    .post(adminAction.csaGroupActivity);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
