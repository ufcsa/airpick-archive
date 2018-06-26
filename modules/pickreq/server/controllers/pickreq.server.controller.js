'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  moment = require('moment-timezone'),
  Request = mongoose.model('Request'),
  nodemailer = require('nodemailer'),
  xoauth2 = require('xoauth2'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var generator = xoauth2.createXOAuth2Generator(config.mailer.options.xoauth2);
generator.on('token', function (token) {
  console.log('New token for %s: %s', token.user, token.accessToken);
});
var mailerOptions = {
  service: config.mailer.options.service,
  auth: config.mailer.options.xoauth2
};
mailerOptions.auth.type = 'OAuth2';
var smtpTransport = nodemailer.createTransport(mailerOptions);
function sendEmail(recipient, subject, body) {
  let mailOptions = {
    from: config.mailer.from,
    to: recipient,
    subject: subject,
    html: body
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
  request.published = req.body.published;

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
  var request = {
    request: req.request,
    volunteer: req.volunteer
  };
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
                firstName: userInfo.firstName,
                displayName: userInfo.displayName,
                email: userInfo.email,
                gender: userInfo.gender,
                phone: userInfo.phone,
                wechatid: userInfo.wechatid,
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
          email: userInfo.email,
          phone: userInfo.phone,
          username: userInfo.username,
          wechatid: userInfo.wechatid
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
exports.accept = function (req, res, next) {
  async.waterfall([
    // update the request status with volunteer information TODO: add record for volunteer Medal count, and admin page for aggregation
    function (done) {
      Request.update({ _id: req.body.request._id },
        { volunteer: req.body.volunteer.username }, { multi: false }, function (err) {
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
    // send email to user regarding pickup
    function (done) {
      var templateOptions = {
        request: req.body.request,
        userInfo: req.body.userInfo,
        appName: config.app.title,
        volunteer: req.body.volunteer
      };
      let raw_time = templateOptions.request.arrivalTime;
      raw_time = moment(raw_time).tz('America/New_York').format();
      raw_time = new Date(raw_time).toString().substr(0, 24);
      templateOptions.request.arrivalTime = raw_time;
      if (req.body.volunteer.username) {
        let counter = 0;
        res.render(path.resolve('modules/pickreq/server/templates/request-accepted'),
          templateOptions, function (err, emailHTML) {
            if (err) {
              console.log('Error preparing req-accepted email templates!');
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            let recipient = req.body.userInfo.email;
            let subject = 'Your request is accepted';
            counter = counter + 1;
            sendEmail(recipient, subject, emailHTML);
            if (counter === 2) {
              done(err);
            }
          });
        res.render(path.resolve('modules/pickreq/server/templates/thank-you-accepting'),
          templateOptions, function (err, emailHTML) {
            if (err) {
              console.log('Error preparing thank-you-accepted email templates!' + err);
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            let recipient = req.body.volunteer.email;
            let subject = 'You just accepted a pick-up request';
            sendEmail(recipient, subject, emailHTML);
            counter = counter + 1;
            if (counter === 2) {
              done(err);
            }
          });
      } else {
        res.render(path.resolve('modules/pickreq/server/templates/request-canceled'),
          templateOptions, function (err, emailHTML) {
            if (err) {
              console.log('Error preparing canceled email templates!');
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            let recipient = req.body.userInfo.email;
            let subject = 'Your request is canceled by the volunteer';
            sendEmail(recipient, subject, emailHTML);
            done(err);
          });
      }
    },
    function (done) {
      res.send({
        message: 'Success!'
      });
      done(null);
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
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
      next();
    } else {
      req.request = request;
      let volunteer = request.volunteer;
      if (volunteer) {
        User.findOne({ username: volunteer }).exec(function (err, userInfo) {
          if (err) {
            return next(err);
          } else if (userInfo) {
            req.volunteer = userInfo;
            console.log(req.volunteer);
            next();
          }
        });
      } else {
        next();
      }
    }
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
