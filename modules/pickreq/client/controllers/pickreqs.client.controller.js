(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('PickreqController', PickreqController);

  PickreqController.$inject = ['$scope', '$state', 'requestsResolve', 'PickreqService', 'Authentication', 'Notification'];

  function PickreqController($scope, $state, requests, PickreqService, Authentication, Notification) {
    var vm = this;

    if (requests) {
      vm.requests = requests.requests;
      vm.requests.forEach(function (rqst) {
        rqst.request.arrivalTime = moment(rqst.request.arrivalTime).tz('America/New_York').format();
      });
    }
    vm.userHasRequest = false;
    var username = Authentication.user.username;

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }

    function findMyRequest() {
      PickreqService.viewMyRequest(username)
        .then(function (response) {
          vm.request = response;
          vm.request.arrivalTime = moment(vm.request.arrivalTime).tz('America/New_York').format();
          // vm.request = response.data;
          if (vm.request.user != null && vm.request.user !== 'undefined') {
            vm.userHasRequest = true;
          }
        });
    }

    function listRequests() {
      vm.requests = PickreqService.list();
    }

    function addRequest(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.requestForm');
        return false;
      }
      var req = vm.request;

      req.arrivalTimeStr = new Date(req.arrivalTime + '00-04:00');

      if (vm.userHasRequest) {
        PickreqService.updateRequest(username, req)
          .then(function (response) {
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Request is successfully updated!' });
            $state.go('pickreqs');
          })
          .catch(function (response) {
            Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Request updating failed!', delay: 6000 });
          });
      } else {
        PickreqService.createRequest(username, req)
          .then(function (response) {
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Request is successfully added!' });
            $state.go('pickreqs');
          })
          .catch(function (response) {
            Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Request adding failed!', delay: 6000 });
          });
      }

    }

    vm.init = findMyRequest;
    vm.addRequest = addRequest;
    vm.init();
  }
}());
