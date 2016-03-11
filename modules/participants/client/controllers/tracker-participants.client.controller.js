(function () {
  'use strict';

  // Participants controller
  angular
    .module('participants')
    .controller('TrackerController', TrackerController);

  TrackerController.$inject = ['$scope', '$state', 'Authentication', 'participantResolve', '$timeout'];

  function TrackerController ($scope, $state, Authentication, participant, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.participant = participant;
    vm.location;

    var refreshLocation = function () {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };

              vm.location = JSON.stringify(pos);
          }, function() {
              console.log('Can not get location!');
          });
      } else {
          console.log('Can not get location!');
      }

      $timeout(refreshLocation, 200);
    };

    refreshLocation();

  }
})();
