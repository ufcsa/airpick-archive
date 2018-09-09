'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mailer = require(path.resolve('./modules/pickreq/server/controllers/mail.server.controller')),
  orientTemp = path.resolve('./modules/users/server/templates/orientation-info'),
  interviewTemp = path.resolve('./modules/users/server/templates/csa-interview');
/**
 * Send email regarding orientation location
 */
exports.orientationEmail = function (req, res) {
  let templateOptions = {
    name: req.body.name,
    table: req.body.table,
    appName: 'CSA IT'
  };
  res.render(orientTemp, templateOptions, function (err, emailHTML) {
    if (err) {
      console.log('Error preparing orientation email template! ' + err);
      res.status(400);
      res.send('Error preparing orientation email template');
    } else {
      let recipient = req.body.receiver;
      let subject = 'UF CSA 2018 Orientation Information';
      mailer.sendEmail(recipient, subject, emailHTML);
      res.send('Success');
    }
  });
};

exports.csaInterviewEmail = function (req, res) {
  let templateOptions = {
    name: req.body.name,
    time: req.body.time,
    appName: 'CSA IT'
  };
  res.render(interviewTemp, templateOptions, function (err, emailHTML) {
    if (err) {
      console.log('Error preparing orientation email template! ' + err);
      res.status(400);
      res.send('Error preparing orientation email template');
    } else {
      let recipient = req.body.receiver;
      let subject = 'CSA Recruitment 2018';
      mailer.sendEmail(recipient, subject, emailHTML);
      res.send('Success');
    }
  });
};
