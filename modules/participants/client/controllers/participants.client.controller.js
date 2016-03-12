(function () {
  'use strict';

  // Participants controller
  angular
    .module('participants')
    .controller('ParticipantsController', ParticipantsController);

  ParticipantsController.$inject = ['$scope', '$state', 'Authentication', 'participantResolve', 'RacesService', 'RacesParticipationsService'];

  function ParticipantsController ($scope, $state, Authentication, participant, RacesService, RacesParticipationsService) {
    var vm = this,
        racesReadyCallback = function () {
          if (vm.races.length > 0 && vm.racesParticipants.length >0) {
            var checkRace = function (rp) {
                  for (var i = 0; i < vm.races.length; i++) {
                    var r = vm.races[i];
                    if (rp.race === r._id) {
                      r.takePart = rp;
                    }
                  }
            };

            for (var i = 0; i < vm.racesParticipants.length; i++) {
              var rp = vm.racesParticipants[i];
              checkRace(rp);
            };
          }
        };

    vm.races = RacesService.query(racesReadyCallback);
    vm.racesParticipants = RacesParticipationsService.query({ participant: participant._id }, racesReadyCallback);
    vm.authentication = Authentication;
    vm.participant = participant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.participate = participate;
    vm.removeParticipation = removeParticipation;

    function removeParticipation(rp) {
      if (confirm('Are you sure you want to remove the participation?')) {
        rp.$remove();
      }
    };

    function participate(raceId) {
        var participation = new RacesParticipationsService();
        participation.race = raceId;
        participation.participant = participant._id;
        participation.firstName = participant.firstName;
        participation.lastName = participant.lastName;
        participation.$save();
    };

    // Remove existing Participant
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.participant.$remove($state.go('participants.list'));
      }
    }

    // Save Participant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.participantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.participant._id) {
        vm.participant.$update(successCallback, errorCallback);
      } else {
        vm.participant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('participants.view', {
          participantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
