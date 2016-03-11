(function () {
  'use strict';

  angular
    .module('trackinginfos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Trackinginfos',
      state: 'trackinginfos',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'trackinginfos', {
      title: 'List Trackinginfos',
      state: 'trackinginfos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'trackinginfos', {
      title: 'Create Trackinginfo',
      state: 'trackinginfos.create',
      roles: ['user']
    });
  }
})();
