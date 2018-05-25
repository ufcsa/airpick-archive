(function () {
  'use strict';

  // Request service used for communicating with the request REST endpoint
  angular
    .module('pickreq.services')
    .service('PickreqService', PickreqService);

  PickreqService.$inject = ['$resource'];

  function PickreqService($resource) {
    var Request = $resource('/api/requests', {}, {
      list: {
        method: 'GET'
      },
      view: {
        method: 'GET',
        url: '/api/requests/:user'
      },
      create: {
        method: 'POST',
        url: '/api/requests/:user'
      },
      update: {
        method: 'PUT',
        url: '/api/requests/:user'
      }
    });

    angular.extend(Request, {
      createRequest: function (user, details) {
        return this.create({
          user: user
        }, details).$promise;
      },
      updateRequest: function (user, details) {
        return this.update({
          user: user
        }, details).$promise;
      },
      viewMyRequest: function (user) {
        return this.view({
          user: user
        }).$promise;
      }
    });

    return Request;
  }
}());
