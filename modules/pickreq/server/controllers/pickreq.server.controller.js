'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var smtpTransport = nodemailer.createTransport(config.mailer.options);
function sendEmail(recipient, subject, body) {
  let mailOptions = {
    from: config.mailer.from,
    to: recipient,
    subject: subject,
    text: body
  };
  smtpTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

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
 * List of pickup requests
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
      if (requests == null || requests.length === 0) {
        res.json(result);
      } else {
        requests.forEach(function (rqst) {
          User.findOne({ username: rqst.user }).then(function (userInfo) {
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
              res.json(result);
            }
          });
        });
      }
    }
  });
};

exports.listAccepted = function (req, res) {
  var requests = req.requests;
  if (!requests) {
    return res.status(422).send({
      message: 'query fails'
    });
  }
  var counter = 0;
  var result = {
    requests: []
  };
  requests.forEach(function (rqst) {
    User.findOne({ username: rqst.user }).then(function (userInfo) {
      var entry = {
        request: rqst,
        userInfo: {
          firstName: userInfo.firstName,
          displayName: userInfo.displayName,
          gender: userInfo.gender,
          email: userInfo.email,
          username: userInfo.username
        }
      };
      counter = counter + 1;
      result.requests.push(entry);
      if (counter === requests.length) {
        res.json(result);
      }
    });
  });
};

/**
 * Update the request with the volunteer's username
 */
exports.accept = function (req, res) {
  async.waterfall([
    // update the request status with volunteer information
    function (done) {
      Request.update({ _id: req.body.request_id },
        { volunteer: req.body.user }, { multi: false }, function (err) {
          if (err) {
            console.log('Accept request fails!');
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            done();
          }
        });
    },
    // lookup
    function () {

    }
  ]);

  Request.findOne({ _id: req.body.rqst.request._id }).exec(function (err, request) {
    request.volunteer = req.body.volunteer.username;
    request.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (req.body.volunteer.username) {
          let toStudent = req.body.volunteer.email;
          let toVolunteer = req.body.student.email;
          let subToStudent = 'Your airport pick-up request is accepted!';
          let subToVolunteer = 'You just accepted one airport pick-up request!';
          let bodyToStudent = 'Thank you for using our service.';
          let bodyToVolunteer = 'Thank you for your service.';
          sendEmail(toVolunteer, subToVolunteer, bodyToVolunteer);
        }
        res.json('Success');
      }
    });
  });
};

exports.prepareBody = function (request) {

};

exports.preStudentEmail = function (student) {
  let message = 'Dear ' + student.firstName + ',\n';
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

/**
 * Find accepted requests middleware
 */
exports.getAccepted = function (req, res, next, volunteer) {
  Request.find({ volunteer: volunteer }).exec(function (err, request) {
    if (err) {
      return next(err);
    } else if (!request) {
      req.requests = null;
    } else {
      req.requests = request;
    }
    next();
  });
};
