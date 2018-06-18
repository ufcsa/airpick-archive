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
        resolve: {
          requestsResolve: getRequests
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('addreq', {
        url: '/addreq',
        templateUrl: '/modules/pickreq/client/views/addreq.client.view.html',
        controller: 'PickreqController',
        controllerAs: 'vm',
        resolve: {
          requestsResolve: empty
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('acceptedreqs', {
        url: '/accepted',
        templateUrl: '/modules/pickreq/client/views/accepted.client.view.html',
        controller: 'AcceptedController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('completed', {
        url: '/completed',
        templateUrl: '/modules/pickreq/client/views/completed.client.view.html',
        controller: 'CompletedController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }

  getRequests.$inject = ['PickreqService'];

  function getRequests(PickreqService) {
    return PickreqService.list({}).$promise;
  }

  function empty() {
    return null;
  }

}());
