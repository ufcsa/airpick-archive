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
        let arrivalTime = rqst.request.arrivalTime;
        arrivalTime = moment(arrivalTime).tz('America/New_York').format();
        rqst.request.timeObj = new Date(arrivalTime);
      });
    }
    vm.userHasRequest = false;

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    var username = Authentication.user.username;
    vm.user = Authentication.user;

    function findMyRequest() {
      console.log(Authentication.user);
      PickreqService.viewMyRequest(username)
        .then(function (response) {
          vm.request = response;
          let arrivalTime = vm.request.arrivalTime;
          if (arrivalTime) {
            arrivalTime = moment(arrivalTime).tz('America/New_York').format();
            vm.request.arrivalTime = new Date(arrivalTime).toString().substr(0, 24);
            // vm.request = response.data;
            if (vm.request.user != null && vm.request.user !== 'undefined') {
              vm.userHasRequest = true;
            }
          }
        });
    }

    function addRequest(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.requestForm');
        return false;
      }
      var req = vm.request;
      req.arrivalTime = new Date(vm.datepicker + ':00-04:00');
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

    function acceptRequest(rqst) {
      var packet = {
        request: rqst.request,
        userInfo: rqst.userInfo,
        volunteer: Authentication.user
      };
      console.log(packet);
      PickreqService.acceptRequest(packet)
        .then(function (response) {
          $state.go($state.current, {}, { reload: true });
        });
    }

    vm.init = findMyRequest;
    vm.addRequest = addRequest;
    vm.acceptRequest = acceptRequest;
    vm.init();
  }
}());

/**
 * Helper functions
 */
function convertStrToDate(dateStr) {
  let date = new Date(dateStr);
  console.log(date.getFullYear());
  return date;
}
