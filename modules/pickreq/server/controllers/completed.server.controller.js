'use strict';

var path = require('path'),
  CronJob = require('cron').CronJob,
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Request = mongoose.model('Request'),
  Completed = mongoose.model('Completed'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * A cron job that checks Completed requests, then save and un-publish them
 * setting: run every 10 minutes
 */
var recycleService = new CronJob('0 */10 * * * *', function () {
  Request.find({ "arrivalTime": { $lt: new Date() } })
    .exec(function (err, requests) {
      if (err) {
        console.log(errorHandler.getErrorMessage(err));
      }
      requests.forEach(function (rqst) {
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
      });
    });
}, null, true, 'America/Los_Angeles');

exports.dummy = function () {

};
