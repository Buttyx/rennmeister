(function () {
  'use strict';

  // Participants controller
  angular
    .module('participants')
    .controller('ParticipantsController', ParticipantsController);

  ParticipantsController.$inject = ['$scope', '$state', 'Authentication', 'participantResolve'];

  function ParticipantsController ($scope, $state, Authentication, participant) {
    var vm = this;

    vm.authentication = Authentication;
    vm.participant = participant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
