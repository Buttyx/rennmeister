(function () {
  'use strict';

  angular
    .module('races')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Races',
      state: 'races',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'races', {
      title: 'List Races',
      state: 'races.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'races', {
      title: 'Create Race',
      state: 'races.create'
    });
  }
})();
