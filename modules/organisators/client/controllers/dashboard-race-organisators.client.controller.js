(function () {
  'use strict';

  angular
    .module('organisators')
    .controller('OrganisatorsRaceDashboardController', OrganisatorsRaceDashboardController);

  OrganisatorsRaceDashboardController.$inject = ['OrganisatorsService', 'ParticipantsService', 'raceResolve'];

  function OrganisatorsRaceDashboardController(OrganisatorsService, ParticipantsService, race) {
    var vm = this;

    vm.race = race;
    vm.participants = ParticipantsService.query({race: vm.race._id});
  }
})();
