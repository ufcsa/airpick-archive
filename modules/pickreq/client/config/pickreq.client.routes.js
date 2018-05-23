(function () {
  'use strict';

  angular
    .module('pickreq.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pickreqs', {
        url: '/pickreqs',
        templateUrl: '/modules/pickreq/client/views/pickreqs.client.view.html',
        controller: 'PickreqController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('addreq', {
        url: '/addreq',
        templateUrl: '/modules/pickreq/client/views/addreq.client.view.html',
        controller: 'PickreqController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
}());
