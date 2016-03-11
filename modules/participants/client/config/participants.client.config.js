(function () {
  'use strict';

  angular
    .module('participants')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Participants',
      state: 'participants',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'participants', {
      title: 'List Participants',
      state: 'participants.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'participants', {
      title: 'Create Participant',
      state: 'participants.create',
      roles: ['user']
    });
  }
})();
