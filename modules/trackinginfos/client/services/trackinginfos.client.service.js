//Trackinginfos service used to communicate Trackinginfos REST endpoints
(function () {
  'use strict';

  angular
    .module('trackinginfos')
    .factory('TrackinginfosService', TrackinginfosService);

  TrackinginfosService.$inject = ['$resource'];

  function TrackinginfosService($resource) {
    return $resource('api/trackinginfos/:trackinginfoId', {
      trackinginfoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
