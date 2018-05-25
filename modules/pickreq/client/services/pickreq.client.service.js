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
        method: 'POST'
      },
      update: {
        method: 'POST',
        url: '/api/request'
      }
    });

    angular.extend(Request, {
      addOrUpdateRequest: function (details) {
        return this.update(details).$promise;
      }
    });
  }
}());
