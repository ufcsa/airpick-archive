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
  Request = mongoose.model('Request'),
  Roomreq = mongoose.model('Roomreq'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Update the request, as a middleware
 */
exports.update = function (req, res, next) {
  if (_.has(req.body, 'request') && req.body.request !== '') {
    Request.findOneAndUpdate({ user: req.username }, req.body.request,
      { upsert: true }, function (err, doc) {
        if (err) {
          console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          next();
        }
      });
  } else {
    next();
  }
};

/**
 * Update the rooming request
 */
exports.updateRm = function (req, res) {
  if (_.has(req.body, 'requestRm') && req.body.requestRm !== '') {
    Roomreq.findOneAndUpdate({ user: req.username }, req.body.requestRm,
      { upsert: true }, function (err, doc) {
        if (err) {
          console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          if (!res.headersSent) {
            res.json('Success');
          }
        }
      });
  } else {
    if (!res.headersSent) {
      res.json('Success');
    }
  }
};

/**
 * Show the current user's request
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var request = {
    request: req.request,
    volunteer: req.volunteer,
    requestRm: req.roomReq,
    volunteerRm: req.roomVlntr
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
  let limit = req.requests.length + req.roomreqs.length;
  var result = {
    requests: [],
    roomreqs: []
  };
  if (limit === 0) {
    res.json(result);
    return null;
  }
  async.waterfall([
    function (done) {
      let requests = req.requests;
      limit = requests.length;
      if (limit === 0) { done(); }
      let counter = 0;
      requests.forEach(function (rqst) {
        User.findOne({ username: rqst.user }).then(function (userInfo) {
          counter = counter + 1;
          let entry = {
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
          result.requests.push(entry);
          if (counter === limit) { done(); }
        });
      });
    },
    function () {
      let roomreqs = req.roomreqs;
      limit = roomreqs.length;
      if (limit === 0) {
        res.json(result);
        return null;
      }
      let counter = 0;
      roomreqs.forEach(function (rqst) {
        User.findOne({ username: rqst.user }).then(function (userInfo) {
          counter = counter + 1;
          let entry = {
            request: rqst,
            userInfo: {
              firstName: userInfo.firstName,
              displayName: userInfo.displayName,
              email: userInfo.email,
              phone: userInfo.phone,
              username: userInfo.username,
              wechatid: userInfo.wechatid,
              gender: userInfo.gender
            }
          };
          result.roomreqs.push(entry);
          if (counter === limit) { res.json(result); }
        });
      });
    }
  ]);
};

/**
 * List of rooming requests
 */
exports.listRm = function (req, res) {
  Roomreq.find({}).sort('startDate').exec(function (err, requests) {
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

/**
 * Update the request with the volunteer's username
 */
exports.accept = function (req, res, next) {
  async.waterfall([
    // TODO: New feature idea: record for volunteer Medal count
    function (done) {
      if (req.body.isRmReq) {
        Roomreq.update({ _id: req.body.request._id },
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
      } else {
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
      }
    },
    // prepare template Options
    function (done) {
      let templateOptions = {
        request: req.body.request,
        userInfo: req.body.userInfo,
        appName: config.app.title,
        volunteer: req.body.volunteer
      };
      let pathUser,
        pathCanc,
        pathTY;
      if (req.body.isRmReq) {
        let raw_time = templateOptions.request.startDate;
        raw_time = moment(raw_time).tz('America/New_York').format('ddd, MMM Do YYYY');
        templateOptions.request.startDate = raw_time;
        let raw_time2 = templateOptions.request.leaveDate;
        raw_time2 = moment(raw_time2).tz('America/New_York').format('ddd, MMM Do YYYY');
        templateOptions.request.leaveDate = raw_time2;
        pathUser = path.resolve('modules/pickreq/server/templates/roomreq-accepted');
        pathCanc = path.resolve('modules/pickreq/server/templates/roomreq-canceled');
        pathTY = path.resolve('modules/pickreq/server/templates/thank-you-accepting-rm');
      } else {
        let raw_time = templateOptions.request.arrivalTime;
        raw_time = moment(raw_time).tz('America/New_York').format('ddd, MMM Do YYYY');
        templateOptions.request.arrivalTime = raw_time;
        pathUser = path.resolve('modules/pickreq/server/templates/request-accepted');
        pathCanc = path.resolve('modules/pickreq/server/templates/request-canceled');
        pathTY = path.resolve('modules/pickreq/server/templates/thank-you-accepting');
      }
      done(null, templateOptions, pathUser, pathCanc, pathTY);
    },
    // send email to user regarding pickup
    function (templateOptions, pathUser, pathCanc, pathTY, done) {
      if (req.body.volunteer.username) {
        res.render(pathUser, templateOptions, function (err, emailHTML) {
          if (err) {
            console.log('Error preparing req-accepted email templates!' + err);
          }
          let recipient = req.body.userInfo.email;
          let subject = 'Your request is accepted';
          mailer.sendEmail(recipient, subject, emailHTML);
        });
        res.render(pathTY, templateOptions, function (err, emailHTML) {
          if (err) {
            console.log('Error preparing thank-you-accepted email templates!' + err);
          }
          let recipient = req.body.volunteer.email;
          let subject = 'You just accepted a request';
          mailer.sendEmail(recipient, subject, emailHTML);
        });
      } else {
        res.render(pathCanc, templateOptions, function (err, emailHTML) {
          if (err) {
            console.log('Error preparing canceled email templates!');
          }
          let recipient = req.body.userInfo.email;
          let subject = 'Your request is canceled by the volunteer';
          mailer.sendEmail(recipient, subject, emailHTML);
        });
      }
      done();
    },
    function () {
      res.send({
        message: 'Success!'
      });
    }
  ]);
};

/**
 * Request middleware
 */
exports.requestUserId = function (req, res, next, un) {
  req.username = un;
  if (_.has(req.body, 'update')) {
    console.log('An update request received. \n');
    next();
  }
  async.waterfall([
    function (done) {
      Request.findOne({ user: un }).exec(function (err, request) {
        if (err) {
          return next(err);
        } else if (!request) {
          req.request = '';
          done();
        } else {
          req.request = request;
          let volunteer = request.volunteer;
          if (volunteer) {
            User.findOne({ username: volunteer }).exec(function (err, userInfo) {
              if (err) {
                req.request = '';
                return done(err);
              } else if (userInfo) {
                req.volunteer = userInfo;
                done();
              }
            });
          } else {
            done();
          }
        }
      });
    },
    function () {
      Roomreq.findOne({ user: un }).exec(function (err, request) {
        if (err) {
          return next(err);
        } else if (!request) {
          req.roomReq = '';
          next();
        } else {
          req.roomReq = request;
          let volunteer = request.volunteer;
          if (volunteer) {
            User.findOne({ username: volunteer }).exec(function (err, userInfo) {
              if (err) {
                req.roomVlntr = '';
                return next(err);
              } else if (userInfo) {
                req.roomVlntr = userInfo;
                next();
              }
            });
          } else {
            next();
          }
        }
      });
    }
  ]);
};

/**
 * Find accepted requests middleware
 */
exports.getAccepted = function (req, res, next, volunteer) {
  async.waterfall([
    function (done) {
      Request.find({ volunteer: volunteer }).exec(function (err, requests) {
        if (err) {
          console.log(err);
        } else if (requests) {
          req.requests = requests;
        } else {
          req.requests = [];
        }
        done();
      });
    },
    function () {
      Roomreq.find({ volunteer: volunteer }).exec(function (err, requests) {
        if (err) {
          console.log(err);
        } else if (requests) {
          req.roomreqs = requests;
        } else {
          req.roomreqs = [];
        }
        next();
      });
    }
  ]);
};
