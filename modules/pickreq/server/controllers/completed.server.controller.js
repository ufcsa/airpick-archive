'use strict';

var path = require('path'),
  CronJob = require('cron').CronJob,
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  Completed = mongoose.model('Completed'),
  async = require('async'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * A cron job that checks Completed requests, then save and un-publish them
 * setting: run every 10 minutes
 */
var recycleService = new CronJob('0 */10 * * * *', function () {
  console.log('Running a clean-up job for passed pick-up requests...');
  Request.find({ 'arrivalTime': { $lt: new Date() } })
    .exec(function (err, requests) {
      if (err) {
        console.log(errorHandler.getErrorMessage(err));
      }
      let counter = 0;
      requests.forEach(function (rqst) {
        if (!rqst.volunteer) { return false; }
        let cmp_rcrd = new Completed();
        cmp_rcrd.airport = rqst.airport;
        cmp_rcrd.arrivalTime = rqst.arrivalTime;
        cmp_rcrd.user = rqst.user;
        cmp_rcrd.volunteer = rqst.volunteer;
        cmp_rcrd.save(function (err) {
          if (err) {
            console.log(errorHandler.getErrorMessage(err));
          }
        });
        Request.update({ _id: rqst._id },
          { volunteer: '', published: false }, { multi: false },
          function (err) {
            if (err) {
              console.log(errorHandler.getErrorMessage(err));
            }
          }
        );
        counter = counter + 1;
      });
      console.log('Clean-up finished. ' + counter + ' job(s) got cleaned up.');
    });
}, null, true, 'America/Los_Angeles');

exports.listCompleted = function (req, res) {
  let requests = {
    requests: {
      myTrips: [],
      vlntrByMe: []
    }
  };
  if (req.myTrips) {
    requests.requests.myTrips = req.myTrips;
  }
  if (req.vlntrByMe) {
    requests.requests.vlntrByMe = req.vlntrByMe;
  }
  res.json(requests);
};

exports.getCompleted = function (req, res, next, user) {
  let counter = 0;
  async.waterfall([
    // First, find requests that are done by me as volunteer.
    function (done) {
      Completed.find({ 'volunteer': user }).exec(function (err, requests) {
        if (err) {
          console.log(errorHandler.getErrorMessage(err));
          done();
        }
        counter = counter + requests.length;
        if (counter === 0) { done(); }
        req.vlntrByMe = [];
        requests.forEach(function (rqst) {
          User.findOne({ 'username': rqst.user }).exec(function (err, request) {
            if (err) {
              console.log(errorHandler.getErrorMessage(err));
            }
            let obj = {};
            obj.request = rqst;
            obj.userInfo = request;
            req.vlntrByMe.push(obj);
            counter = counter - 1;
            if (counter === 0) { done(); }
          });
        });
      });
    },
    // Then, find requests that I requested and completed.
    function () {
      Completed.find({ 'user': user }).exec(function (err, requests) {
        if (err) {
          console.log(errorHandler.getErrorMessage(err));
          next();
        }
        counter = counter + requests.length;
        console.log(counter);
        req.myTrips = [];
        requests.forEach(function (rqst) {
          User.findOne({ 'username': rqst.volunteer }).exec(function (err, request) {
            if (err) {
              console.log(errorHandler.getErrorMessage(err));
            }
            let obj = {};
            obj.request = rqst;
            obj.volunteer = request;
            req.myTrips.push(obj);
            counter = counter - 1;
            if (counter === 0) { next(); }
          });
        });
      });
    }
  ]);
};
