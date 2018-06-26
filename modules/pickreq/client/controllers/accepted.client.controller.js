(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('AcceptedController', AcceptedController);

  AcceptedController.$inject = ['$scope', '$state', 'PickreqService', 'Authentication', 'Notification'];

  function AcceptedController($scope, $state, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault("America/New_York");

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;

    function findMyAccepted() {
      PickreqService.listAccepted(username)
        .then(function (response) {
          if (response) {
            vm.requests = response.requests;
            vm.requests.forEach(function (rqst) {
              let time = moment(rqst.request.arrivalTime)
                .tz('America/New_York').format('ddd, MMM Do YYYY hh:mm A');
              rqst.request.timeObj = time;
            });
          }
        });
    }

    function cancelRequest(rqst) {
      let usr = Object.assign({}, vm.user);
      var packet = {
        request: rqst.request,
        userInfo: rqst.userInfo,
        volunteer: usr
      };
      packet.volunteer.username = '';
      PickreqService.acceptRequest(packet) // reuse this method for canceling
        .then(function (response) {
          $state.go($state.current, {}, { reload: true });
        });
    }

    vm.init = findMyAccepted;
    vm.cancelRequest = cancelRequest;
    vm.init();
  }
}());
