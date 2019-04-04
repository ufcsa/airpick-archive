var path = require('path'),
  nodemailer = require('nodemailer'),
  xoauth2 = require('xoauth2'),
  config = require(path.resolve('./config/config'));

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
  sendEmailWithAttachment(recipient, subject, body, null);
}

function sendEmailWithAttachment(recipient, subject, body, attachments) {
  let mailOptions = {
    from: config.mailer.from,
    to: recipient,
    subject: subject,
    html: body,
    attachments: attachments
  };
  smtpTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

exports.sendEmail = sendEmail;
