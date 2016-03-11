(function () {
  'use strict';

  // Trackinginfos controller
  angular
    .module('trackinginfos')
    .controller('TrackinginfosController', TrackinginfosController);

  TrackinginfosController.$inject = ['$scope', '$state', 'Authentication', 'trackinginfoResolve'];

  function TrackinginfosController ($scope, $state, Authentication, trackinginfo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.trackinginfo = trackinginfo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Trackinginfo
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.trackinginfo.$remove($state.go('trackinginfos.list'));
      }
    }

    // Save Trackinginfo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trackinginfoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.trackinginfo._id) {
        vm.trackinginfo.$update(successCallback, errorCallback);
      } else {
        vm.trackinginfo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trackinginfos.view', {
          trackinginfoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
