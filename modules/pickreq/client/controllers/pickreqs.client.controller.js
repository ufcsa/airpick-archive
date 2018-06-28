(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('PickreqController', PickreqController);
  PickreqController.$inject = ['$scope', '$state', 'requestsResolve', 'PickreqService', 'Authentication', 'Notification'];

  function PickreqController($scope, $state, requests, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault('America/New_York');
    vm.needRoom = false;

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;

    if (requests) {
      vm.requests = requests.requests;
      vm.requests.forEach(function (rqst) {
        let arrivalTime = rqst.request.arrivalTime;
        rqst.request.timeObj = formatDateTime(arrivalTime);
      });
    }

    function findMyRequest() {
      PickreqService.viewMyRequest(username)
        .then(function (response) {
          vm.request = response.request;
          vm.volunteer = response.volunteer;
          vm.requestRm = response.requestRm;
          vm.volunteer = response.volunteerRm;
          let arrivalTime = vm.request.arrivalTime;
          let startDate = vm.requestRm.startDate;
          let leaveDate = vm.requestRm.leaveTime;
          vm.request.timeObj = formatDateTime(arrivalTime);
          vm.requestRm.startDateObj = formatDate(startDate);
          vm.requestRm.leaveDateObj = formatDate(leaveDate);
        });
    }

    function addRequest(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.requestForm');
        return false;
      }
      let req = vm.request;
      let reqrm = vm.requestRm;
      let request = {
        request: req,
        requestRm: reqrm
      };

      if (vm.datepicker && vm.datepicker.toString().length > 14) {
        req.arrivalTime = moment(vm.datepicker).format();
        if (!verifyFutureDate(req.arrivalTime)) {
          return false;
        }
        req.timeObj = moment(req.arrivalTime).format('ddd, MMM Do YYYY HH:mm');
      } else if (!verifyFutureDate(req.arrivalTime)) {
        return false;
      }

      if (vm.startDate && vm.startDate.toString().length > 7) {
        reqrm.startDate = moment(vm.startDate).format();
        if (!verifyFutureDate(reqrm.startDate)) {
          return false;
        }
        reqrm.startDateObj = moment(reqrm.startDate).format('ddd, MMM Do YYYY');
      } else if (!verifyFutureDate(reqrm.startDate)) {
        return false;
      }

      if (vm.leaveDate && vm.leaveDate.toString().length > 7) {
        reqrm.leaveDate = moment(vm.leaveDate).format();
        if (!verifyFutureDate(reqrm.leaveDate)) {
          return false;
        }
        let time1 = new Date(reqrm.startDate);
        let time2 = new Date(reqrm.leaveDate);
        if (time1 >= time2) {
          return false;
        }
        reqrm.leaveDateObj = moment(reqrm.leaveDate).format('ddd, MMM Do YYYY');
      } else if (!verifyFutureDate(reqrm.leaveDate)) {
        return false;
      }

      PickreqService.updateRequest(username, request)
        .then(function (response) {
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Request(s) successfully added!' });
          $state.go('pickreqs');
        })
        .catch(function (response) {
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Request(s) adding failed!', delay: 6000 });
        });
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

    function verifyFutureDate(dateStr) {
      let newDate = new Date(dateStr);
      let now = new Date();
      if (newDate <= now) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please enter a future date/time!', delay: 6000 });
        return false;
      }
      return true;
    }

    function formatDateTime(timeStr) {
      if (timeStr) {
        return moment(timeStr).format('ddd, MMM Do YYYY HH:mm');
      }
      return '';
    }

    function formatDate(dateStr) {
      if (dateStr) {
        return moment(dateStr).format('ddd, MMM Do YYYY');
      }
      return '';
    }

    function toggleRoom() {
      vm.needRoom = !vm.needRoom;
    }

    vm.init = findMyRequest;
    vm.addRequest = addRequest;
    vm.acceptRequest = acceptRequest;
    vm.toggleRoom = toggleRoom;
    vm.init();
  }
}());
