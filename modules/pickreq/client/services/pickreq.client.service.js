(function () {
  'use strict';

  // Request service used for communicating with the request REST endpoint
  angular
    .module('pickreq.services')
    .factory('PickreqService', PickreqService);

  PickreqService.$inject = ['$resource'];

  function PickreqService($resource) {
    var Request = $resource('/api/requests', {}, {
      list: {
        method: 'GET'
      },
      update: {
        method: 'POST'
      }
    };

    angular.extend(Request, {
      addOrUpdateRequest: function (details) {
        return this.update(details).$promise;
      }
    });
  }
}());
