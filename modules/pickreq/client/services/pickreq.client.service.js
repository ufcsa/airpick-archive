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
      accepted: {
        method: 'GET',
        url: '/api/requests/:volunteer'
      },
      accept: {
        method: 'POST',
        url: '/api/request/accept'
      },
      view: {
        method: 'GET',
        url: '/api/request/:user'
      },
      create: {
        method: 'POST',
        url: '/api/request/:user'
      },
      update: {
        method: 'PUT',
        url: '/api/request/:user'
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
      },
      acceptRequest: function (details) {
        return this.accept(
          details
        ).$promise;
      },
      listAccepted: function (volunteer) {
        return this.accepted({
          volunteer: volunteer
        }).$promise;
      }
    });

    return Request;
  }
}());
