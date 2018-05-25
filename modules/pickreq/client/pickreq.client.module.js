(function (app) {
  'use strict';

  app.registerModule('pickreq', ['core']);
  app.registerModule('pickreq.routes', ['ui.router', 'core.routes']);
  app.registerModule('pickreq.services');
}(ApplicationConfiguration));
