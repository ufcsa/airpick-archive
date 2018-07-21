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
      listRm: {
        method: 'GET',
        url: '/api/roomreqs'
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
      update: {
        method: 'PUT',
        url: '/api/request/:user'
      },
      completed: {
        method: 'GET',
        url: '/api/requests/completed/:user'
      }
    });

    angular.extend(Request, {
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
      },
      listCompleted: function (user) {
        return this.completed({
          user: user
        }).$promise;
      }
    });

    return Request;
  }
}());
