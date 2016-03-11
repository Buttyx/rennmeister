//Participants service used to communicate Participants REST endpoints
(function () {
  'use strict';

  angular
    .module('participants')
    .factory('ParticipantsService', ParticipantsService);

  ParticipantsService.$inject = ['$resource'];

  function ParticipantsService($resource) {
    return $resource('api/participants/:participantId', {
      participantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
