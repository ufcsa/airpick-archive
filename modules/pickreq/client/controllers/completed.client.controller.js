(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('CompletedController', CompletedController);

  CompletedController.$inject = ['$scope', '$state', 'PickreqService', 'Authentication', 'Notification'];

  function CompletedController($scope, $state, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault('America/New_York');

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;

    function findMyCompleted() {
      PickreqService.listCompleted(username)
        .then(function (response) {
          if (response) {
            vm.myTrips = response.requests.myTrips;
            vm.vlntrByMe = response.requests.vlntrByMe;
            vm.myTrips.forEach(function (rqst) {
              let time = moment(rqst.request.arrivalTime)
                .tz('America/New_York').format('ddd, MMM Do YYYY hh:mm A');
              rqst.request.timeObj = time;
            });
            vm.vlntrByMe.forEach(function (rqst) {
              let time = moment(rqst.request.arrivalTime)
                .tz('America/New_York').format('ddd, MMM Do YYYY hh:mm A');
              rqst.request.timeObj = time;
            });
          }
        });
    }

    vm.init = findMyCompleted;
    vm.init();
  }
}());
