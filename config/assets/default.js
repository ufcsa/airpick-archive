'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'bower_components/lib/bootstrap/dist/css/bootstrap.css',
        'bower_components/lib/bootstrap/dist/css/bootstrap-theme.css',
        'bower_components/lib/moment-picker/dist/angular-moment-picker.min.css',
        'bower_components/lib/angular-ui-notification/dist/angular-ui-notification.css'
        // endbower
      ],
      js: [
        // bower:js
        'bower_components/lib/angular/angular.js',
        'bower_components/lib/angular-animate/angular-animate.js',
        'bower_components/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/lib/ng-file-upload/ng-file-upload.js',
        'bower_components/lib/angular-messages/angular-messages.js',
        'bower_components/lib/angular-mocks/angular-mocks.js',
        'bower_components/lib/angular-resource/angular-resource.js',
        'bower_components/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'bower_components/lib/angular-ui-router/release/angular-ui-router.js',
        'bower_components/lib/moment/moment.js',
        'bower_components/lib/moment-picker/dist/angular-moment-picker.min.js',
        'bower_components/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'bower_components/moment-timezone-with-data.min.js'
        // endbower
      ],
      tests: ['bower_components/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
