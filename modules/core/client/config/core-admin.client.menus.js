(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });

    menuService.addMenuItem('topbar', {
      title: 'Volunteer',
      state: 'user',
      type: 'dropdown',
      roles: ['user']
    });
  }
}());
