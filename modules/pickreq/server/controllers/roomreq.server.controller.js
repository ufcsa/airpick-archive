'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  moment = require('moment-timezone'),
  mailer = require(path.resolve('./modules/pickreq/server/controllers/mail.server.controller')),
  Roomreq = mongoose.model('Roomreq'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
