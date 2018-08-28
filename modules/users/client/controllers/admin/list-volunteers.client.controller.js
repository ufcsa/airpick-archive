(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('VolunteerListController', VolunteerListController);

  VolunteerListController.$inject = ['$scope', '$filter', 'UsersService'];

  function VolunteerListController($scope, $filter, UsersService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    UsersService.query(function (data) {
      findVolunteers(data, vm.buildPager);
    });

    function findVolunteers(users, next) {
      vm.volunteers = [];
      let counter = 0;
      users.forEach(user => {
        UsersService.listVolunteers(user.username)
          .then((data) => {
            ++counter;
            if (data.requests.length || data.roomreqs.length) {
              user.pickreqs = data.requests;
              user.roomreqs = data.roomreqs;
              vm.volunteers.push(user);
            }
            if (counter === users.length) {
              next();
            }
          })
          .catch(err => { ++counter; });
      });
    }

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 20;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.volunteers, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
