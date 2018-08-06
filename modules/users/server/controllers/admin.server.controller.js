'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Request = mongoose.model('Request'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async');

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * list of this user's accepted request
 */
exports.reqAccept = function (req, res) {
  let limit = req.airAcc.length + req.roomAcc.length;
  var rst = {
    airAcc: []
  };
  if (limit === 0) {
    res.json(rst);
    return null;
  }
  async.waterfall([
    function (done) {
      let airAcc = req.airAcc;
      limit = airAcc.length;
      if (limit === 0) {
        done();
      }
      let counter = 0;
      airAcc.forEach(rqst => {
        User.find({ username: rqst.user }).then(userInfo => {
          counter = counter + 1;
          let entry = {
            request: rqst,
            userInfo: {
              displayName: userInfo.displayName,
              username: userInfo.username
            }
          };
          rst.airAcc.push(entry);
          if (counter === limit) { done(); }
        });
      });
    },
    function () {
      res.json(rst);
    }
  ]);
};


/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }
  async.waterfall([
    function (done) {
      User.findById(id, '-salt -password -providerData').exec(function (err, user) {
        if (err) {
          console.log(err);
        } else if (!user) {
          console.log(new Error('Failed to load user ' + id));
        }
        req.model = user;
        done();
      });
    },
    function () {
      Request.find({ volunteer: id }).exec(function (err, requests) {
        if (err) {
          console.log(err);
        } else if (requests) {
          req.airAcc = requests;
        } else {
          req.airAcc = [];
        }
        next();
      });
    }
  ]);
  // User.findById(id, '-salt -password -providerData').exec(function (err, user) {
  //   if (err) {
  //     return next(err);
  //   } else if (!user) {
  //     return next(new Error('Failed to load user ' + id));
  //   }

  //   req.model = user;
  // });
};
