(function () {
  'use strict';

  angular
    .module('organisators')
    .controller('OrganisatorsDashboardController', OrganisatorsDashboardController);

  OrganisatorsDashboardController.$inject = ['OrganisatorsService'];

  function OrganisatorsDashboardController(OrganisatorsService) {
    var vm = this;

    vm.organisators = OrganisatorsService.query();
  }
})();
