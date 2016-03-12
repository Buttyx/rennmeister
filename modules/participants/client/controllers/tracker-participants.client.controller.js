(function () {
  'use strict';

  // Participants controller
  angular
    .module('participants')
    .controller('TrackerController', TrackerController);

  TrackerController.$inject = ['$scope', '$state', 'Authentication', 'participantResolve', 'raceResolve', 'TrackinginfosService', '$timeout'];

  function TrackerController ($scope, $state, Authentication, participant, race, TrackinginfosService, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.participant = participant;
    vm.race = race;
    vm.locations = [];

    var refreshLocation = function () {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  },
                  trackingInfosService = new TrackinginfosService();

              trackingInfosService.participant = vm.participant._id;
              trackingInfosService.pulse = Math.random()*80 +100;
              trackingInfosService.race = race;
              trackingInfosService.lat = pos.lat;
              trackingInfosService.lng = pos.lng;

              trackingInfosService.$save()
              vm.locations.push(pos);


          }, function() {
              console.log('Can not get location!');
          });
      } else {
          console.log('Can not get location!');
      }

      $timeout(refreshLocation, 5000);
    };

    refreshLocation();

  }
})();
