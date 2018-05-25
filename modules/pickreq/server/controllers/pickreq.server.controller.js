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
  request.user = req.username;

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

  request.airport = req.body.airport;
  request.arrivalTime = req.body.arrivalTime;
  request.bag = req.body.bag;
  request.carryon = req.body.carryon;
  request.baggage = req.body.baggage;

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
 * Show the current user's request
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var request = req.request ? req.request : {};
  res.json(request);
};

/**
 * List of pickup requests TODO: aggregation & get user info
 */
exports.list = function (req, res) {
  Request.find({}).sort('arrivalTime').exec(function (err, requests) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var counter = 0;
      var result = {
        requests: []
      };
      requests.forEach(function (rqst) {
        getUserInfo(rqst.user).then(function (userInfo) {
          var entry = {
            request: rqst,
            userInfo: {
              displayName: userInfo.displayName,
              gender: userInfo.gender,
              email: userInfo.email,
              username: userInfo.username
            }
          };
          counter = counter + 1;
          result.requests.push(entry);
          if (counter === requests.length) {
            console.log(result);
            res.json(result);
          }
        });
      });
    }
  });

  function getUserInfo(un) {
    // lookup User's information
    return User.findOne({ username: un });
  }
};

/**
 * Request middleware
 */
exports.requestUserId = function (req, res, next, un) {
  req.username = un;

  Request.findOne({ user: un }).exec(function (err, request) {
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
