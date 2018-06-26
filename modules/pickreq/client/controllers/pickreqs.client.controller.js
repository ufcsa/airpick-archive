(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('PickreqController', PickreqController);

  PickreqController.$inject = ['$scope', '$state', 'requestsResolve', 'PickreqService', 'Authentication', 'Notification'];

  function PickreqController($scope, $state, requests, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault("America/New_York");

    if (requests) {
      vm.requests = requests.requests;
      vm.requests.forEach(function (rqst) {
        let arrivalTime = rqst.request.arrivalTime;
        arrivalTime = moment(arrivalTime).format('ddd, MMM Do YYYY HH:mm');
        rqst.request.timeObj = arrivalTime;
      });
    }
    vm.userHasRequest = false;

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;


    function findMyRequest() {
      console.log(moment.tz.guess());
      PickreqService.viewMyRequest(username)
        .then(function (response) {
          vm.request = response.request;
          vm.volunteer = response.volunteer;
          let arrivalTime = vm.request.arrivalTime;
          if (arrivalTime) {
            arrivalTime = moment(arrivalTime).format('ddd, MMM Do YYYY HH:mm');
            vm.request.timeObj = arrivalTime;
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
      if (vm.datepicker && vm.datepicker.toString().length > 15) {
        req.arrivalTime = moment(vm.datepicker).format();
        let newDate = new Date(req.arrivalTime);
        let now = new Date();
        if (newDate <= now) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please enter a future date/time!', delay: 6000 });
          return false;
        }
        newDate = moment(req.arrivalTime).format('ddd, MMM Do YYYY HH:mm');
        req.timeObj = newDate;
      } else {
        let timeObj = new Date(req.arrivalTime);
        let now = new Date();
        if (timeObj <= now) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please enter a future date/time!', delay: 6000 });
          return false;
        }
      }
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
      let usr = vm.user;
      var packet = {
        request: rqst.request,
        userInfo: rqst.userInfo,
        volunteer: usr
      };
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
