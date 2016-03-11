(function () {
  'use strict';

  angular
    .module('organisators')
    .controller('OrganisatorsDashboardController', OrganisatorsDashboardController);

  OrganisatorsDashboardController.$inject = ['OrganisatorsService', 'RacesService'];

  function OrganisatorsDashboardController(OrganisatorsService, RacesService) {
    var vm = this;

    vm.organisators = OrganisatorsService.query();
    vm.races = RacesService.query();
  }
})();
