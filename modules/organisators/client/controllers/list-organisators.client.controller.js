(function () {
  'use strict';

  angular
    .module('organisators')
    .controller('OrganisatorsListController', OrganisatorsListController);

  OrganisatorsListController.$inject = ['OrganisatorsService'];

  function OrganisatorsListController(OrganisatorsService) {
    var vm = this;

    vm.organisators = OrganisatorsService.query();
  }
})();
