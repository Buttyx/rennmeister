(function () {
  'use strict';

  angular
    .module('trackinginfos')
    .controller('TrackinginfosListController', TrackinginfosListController);

  TrackinginfosListController.$inject = ['TrackinginfosService'];

  function TrackinginfosListController(TrackinginfosService) {
    var vm = this;

    vm.trackinginfos = TrackinginfosService.query();
  }
})();
