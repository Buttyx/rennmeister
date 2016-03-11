//Races service used to communicate Races REST endpoints
(function () {
  'use strict';

  angular
    .module('races')
    .factory('RacesParticipationsService', RacesService);

  RacesService.$inject = ['$resource'];

  function RacesService($resource) {
    return $resource('api/races-participants/:raceId', {
      raceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
