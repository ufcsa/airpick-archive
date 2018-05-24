(function () {
  'use strict';

  angular
    .module('pickreq')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Pickup Requests',
      state: 'pickreqs'
    });
    menuService.addMenuItem('topbar', {
      title: 'Add Your Request',
      state: 'addreq'
    });
  }
}());
