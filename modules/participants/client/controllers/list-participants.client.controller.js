(function () {
  'use strict';

  angular
    .module('participants')
    .controller('ParticipantsListController', ParticipantsListController);

  ParticipantsListController.$inject = ['ParticipantsService'];

  function ParticipantsListController(ParticipantsService) {
    var vm = this;

    vm.participants = ParticipantsService.query();
  }
})();
