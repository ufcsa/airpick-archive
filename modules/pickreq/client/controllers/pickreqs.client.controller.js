(function () {
  'use strict';

  angular
    .module('pickreq')
    .controller('PickreqController', PickreqController);

  PickreqController.$inject = ['$scope', '$state', 'PickreqService', 'Authentication', 'Notification'];

  function PickreqController($scope, $state, PickreqService, Authentication, Notification) {
    var vm = this;

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $state.go('home');
    }

    function addRequest(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.requestForm');

        return false;
      }
      var req = vm.request;
      req.timeArrival = req.year + '-' + req.month + '-' + req.day +
        'T' + req.hour + ':' + req.minute + ':00Z';

      req.username = Authentication.user.username;
      PickreqService.addOrUpdateRequest(req)
        .then(onUpdateRequestSuccess)
        .catch(onUpdateRequestError);
    }

    // Request adding Callbacks
    function onUpdateRequestSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Request is successfully added!' });
      // And redirect to the list request page
      $state.go('pickreqs');
    }

    function onUpdateRequestError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Request adding failed!', delay: 6000 });
    }
  }
}());
