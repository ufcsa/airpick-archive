(function (app) {
  'use strict';

  app.registerModule('pickreq', ['core', 'moment-picker']);
  app.registerModule('pickreq.services');
  app.registerModule('pickreq.routes', ['ui.router', 'core.routes', 'pickreq.services']);

}(ApplicationConfiguration));
