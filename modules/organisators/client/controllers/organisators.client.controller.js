(function () {
  'use strict';

  // Organisators controller
  angular
    .module('organisators')
    .controller('OrganisatorsController', OrganisatorsController);

  OrganisatorsController.$inject = ['$scope', '$state', 'Authentication', 'organisatorResolve'];

  function OrganisatorsController ($scope, $state, Authentication, organisator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.organisator = organisator;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Organisator
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.organisator.$remove($state.go('organisators.list'));
      }
    }

    // Save Organisator
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.organisatorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.organisator._id) {
        vm.organisator.$update(successCallback, errorCallback);
      } else {
        vm.organisator.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('organisators.view', {
          organisatorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
