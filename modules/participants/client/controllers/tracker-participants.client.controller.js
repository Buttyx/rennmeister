(function () {
  'use strict';

  // Participants controller
  angular
    .module('participants')
    .controller('TrackerController', TrackerController);

  TrackerController.$inject = ['$scope', '$state', 'Authentication', 'participantResolve', 'TrackinginfosService', '$timeout'];

  function TrackerController ($scope, $state, Authentication, participant, TrackinginfosService, $timeout) {
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
                  },
                  trackingInfosService = new TrackinginfosService();

              trackingInfosService.participant = vm.participant._id;
              trackingInfosService.pulse = 156;
              trackingInfosService.race = '56e318bbea64528fdbc1ffda';
              trackingInfosService.lat = pos.lat;
              trackingInfosService.lng = pos.lng;

              trackingInfosService.$save()
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
