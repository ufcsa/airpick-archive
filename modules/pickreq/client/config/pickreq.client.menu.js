(function () {
  'use strict';

  angular
    .module('pickreq')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addSubMenuItem('topbar', 'user', {
      title: 'Pickup Requests',
      state: 'pickreqs'
    });
    menuService.addSubMenuItem('topbar', 'user', {
      title: 'Lodging Requests',
      state: 'roomreqs'
    });
    menuService.addSubMenuItem('topbar', 'user', {
      title: 'Requests Accepted',
      state: 'acceptedreqs'
    });

    menuService.addMenuItem('topbar', {
      title: 'View Your Request',
      state: 'addreq'
    });

    menuService.addMenuItem('topbar', {
      title: 'Completed Trips',
      state: 'completed'
    });
  }
}());
