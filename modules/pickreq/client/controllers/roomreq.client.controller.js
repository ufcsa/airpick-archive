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

    if (roomReqs) {
      vm.requests = roomReqs.requests;
      vm.requests.forEach(function (rqst) {
        let startDate = rqst.request.startDate;
        let leaveDate = rqst.request.leaveDate;
        rqst.request.startDateObj = formatDate(startDate);
        rqst.request.leaveDateObj = formatDate(leaveDate);
      });
    }

    function formatDate(dateStr) {
      if (dateStr) {
        return moment(dateStr).format('ddd, MMM Do YYYY');
      }
      return '';
    }
  }
}());
