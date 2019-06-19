(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('RoomreqController', RoomreqController);

  RoomreqController.$inject = ['$scope', '$state', 'requestsResolve', 'PickreqService', 'Authentication', 'Notification'];

  function RoomreqController($scope, $state, roomReqs, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault('America/New_York');

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;
    $scope.loading = true;
    console.log('getting data')
    if (roomReqs) {
      console.log('got data!')
      $scope.loading = false;
      vm.requests = roomReqs.requests;
      vm.requests.forEach(function (rqst) {
        let startDate = rqst.request.startDate;
        let leaveDate = rqst.request.leaveDate;
        rqst.request.startDateObj = formatDate(startDate);
        rqst.request.leaveDateObj = formatDate(leaveDate);
      });
    }

    function acceptRequest(rqst) {
      let usr = vm.user;
      var packet = {
        request: rqst.request,
        userInfo: rqst.userInfo,
        volunteer: usr,
        isRmReq: true
      };
      PickreqService.acceptRequest(packet)
        .then(function (response) {
          $state.go($state.current, {}, { reload: true });
        });
    }

    function formatDate(dateStr) {
      if (dateStr) {
        return moment(dateStr).format('ddd, MMM Do YYYY');
      }
      return '';
    }

    vm.acceptRequest = acceptRequest;
  }
}());
