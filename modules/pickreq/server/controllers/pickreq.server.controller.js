'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

  /**
   * Create a pickup request
   */
exports.create = function (req, res) {
  var request = new Request(req.body);
  request.user = req.user;

  request.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(request);
    }
  });
};

/**
 * Update the request
 */
exports.update = function (req, res) {
  var request = req.request;

  request.title = req.body.title;
  request.content = req.body.content;

  request.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(request);
    }
  });
};

/**
 * Show the current requests
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var request = req.request ? req.request.toJSON() : {};

  res.json(request);
};

/**
 * List of pickup requests TODO: aggregation & get user info
 */
exports.list = function (req, res) {
  Request.findById().sort('-arrivalTime').exec(function (err, requests) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(requests);
    }
  });
};

/**
 * Request middleware
 */
exports.requestUserId = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pickup request is invalid'
    });
  }

  Request.find({ user: id }).exec(function (err, request) {
    if (err) {
      return next(err);
    } else if (!request) {
      req.request = null;
    } else {
      req.request = request;
    }
    next();
  });
};

exports.getUserInfo = function (req, res, next) {
  // Add a field for User's information
  User.findById(req.body.user).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      req.userInfo = null;
    } else {
      req.userInfo = user;
    }
    next();
  });
};
