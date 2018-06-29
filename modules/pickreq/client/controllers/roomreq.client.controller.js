(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('RoomreqController', RoomreqController);

  RoomreqController.$inject = ['$scope', '$state', 'PickreqService', 'Authentication', 'Notification'];

  function RoomreqController($scope, $state, PickreqService, Authentication, Notification) {
    var vm = this;
    moment.tz.setDefault('America/New_York');

    // If user is not signed in then redirect back home
    if (!Authentication.user) { $state.go('home'); }
    vm.user = Authentication.user;
    var username = vm.user.username;

    // TODO add load room request function


    vm.init();
  }
}());
