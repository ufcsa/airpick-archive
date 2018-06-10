(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('CompletedController', CompletedController);

  CompletedController.$inject = ['$scope', '$state', 'PickreqService', 'Authentication', 'Notification'];

  function CompletedController($scope, $state, PickreqService, Authentication, Notification) {
    var vm = this;

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
                .tz('America/New_York').format();
              rqst.request.timeObj = new Date(time).toString().substr(0,24);
            });
            vm.vlntrByMe.forEach(function (rqst) {
              let time = moment(rqst.request.arrivalTime)
                .tz('America/New_York').format();
              rqst.request.timeObj = new Date(time).toString().substr(0,24);
            });
          }
        });
    }

    vm.init = findMyCompleted;
    vm.init();
  }
}());
