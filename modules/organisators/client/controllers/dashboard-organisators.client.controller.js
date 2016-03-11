(function () {
  'use strict';

  angular
    .module('organisators')
    .controller('OrganisatorsDashboardController', OrganisatorsDashboardController);

  OrganisatorsDashboardController.$inject = ['OrganisatorsService', 'RacesService', 'organisatorResolve'];

  function OrganisatorsDashboardController(OrganisatorsService, RacesService, organisator) {
    var vm = this;

    vm.organisator = organisator;
    vm.races = RacesService.query({organisator: vm.organisator._id});
  }
})();
