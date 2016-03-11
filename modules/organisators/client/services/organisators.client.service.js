//Organisators service used to communicate Organisators REST endpoints
(function () {
  'use strict';

  angular
    .module('organisators')
    .factory('OrganisatorsService', OrganisatorsService);

  OrganisatorsService.$inject = ['$resource'];

  function OrganisatorsService($resource) {
    return $resource('api/organisators/:organisatorId', {
      organisatorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
