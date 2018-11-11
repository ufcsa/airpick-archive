'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mailer = require(path.resolve('./modules/pickreq/server/controllers/mail.server.controller')),
  orientTemp = path.resolve('./modules/users/server/templates/orientation-info'),
  interviewTemp = path.resolve('./modules/users/server/templates/csa-interview'),
  accepted = path.resolve('./modules/users/server/templates/interview-accepted'),
  rejected = path.resolve('./modules/users/server/templates/interview-rejected'),
  qualified = path.resolve('./modules/users/server/templates/bestsinger-qualified'),
  disqualified = path.resolve('./modules/users/server/templates/bestsinger-disqualified'),
  bestsinger = path.resolve('./modules/users/server/templates/bestsinger');
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

exports.csaInterviewResults = function (req, res) {
  let templateOptions = {
    name: req.body.name,
    department: req.body.department,
    appName: 'CSA IT'
  };
  let emailTemp = accepted;
  if (!req.body.department || req.body.department.length < 1) {
    emailTemp = rejected;
  }
  res.render(emailTemp, templateOptions, function (err, emailHTML) {
    if (err) {
      console.log('Error preparing orientation email template! ' + err);
      res.status(400);
      res.send('Error preparing orientation email template');
    } else {
      let recipient = req.body.receiver;
      let subject = 'CSA Fall 2018 Recruitment Result';
      mailer.sendEmail(recipient, subject, emailHTML);
      res.send('Success');
    }
  });
};

exports.csaBestSingerRegistered = function (req, res) {
  let templateOptions = {
    name: req.body.name,
    time: req.body.time,
    appName: 'CSA IT'
  };
  let emailTemp = bestsinger;
  res.render(emailTemp, templateOptions, function (err, emailHTML) {
    if (err) {
      console.log('Error preparing orientation email template! ' + err);
      res.status(400);
      res.send('Error preparing orientation email template');
    } else {
      let recipient = req.body.receiver;
      let subject = 'CSA Fall 2018 Best Singers Contest';
      mailer.sendEmail(recipient, subject, emailHTML);
      res.send('Success');
    }
  });
};

exports.csaBestSingerTop16 = function(req, res) {
  let templateOptions = {
    name: req.body.name,
    appName: 'CSA IT'
  };
  let emailTemp = qualified;
  if (!req.body.qualified || req.body.qualified.length > 1) {
    emailTemp = disqualified;
  }
  res.render(emailTemp, templateOptions, function (err, emailHTML) {
    if (err) {
      console.log('Error preparing orientation email template! ' + err);
      res.status(400);
      res.send('Error preparing orientation email template');
    } else {
      let recipient = req.body.receiver;
      let subject = 'CSA Fall 2018 Best Singer Contest Result';
      mailer.sendEmail(recipient, subject, emailHTML);
      res.send('Success');
    }
  });
}
