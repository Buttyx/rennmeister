(function () {
  'use strict';

  angular
    .module('organisators')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('organisators', {
        abstract: true,
        url: '/organisators',
        template: '<ui-view/>'
      })
      .state('organisators.dashboard', {
        url: '/dashboard/:organisatorId',
        templateUrl: 'modules/organisators/client/views/dashboard-organisators.client.view.html',
        controller: 'OrganisatorsDashboardController',
        controllerAs: 'vm',
        resolve: {
          organisatorResolve: getOrganisator
        },
        data: {
          pageTitle: 'Organisators Dashboard'
        }
      })
      .state('organisators.race.dashboard', {
        url: '/dashboard/race/:raceId',
        templateUrl: 'modules/organisators/client/views/dashboard-race-organisators.client.view.html',
        controller: 'OrganisatorsRaceDashboardController',
        controllerAs: 'vm',
        resolve: {
          raceResolve: getRace
        },
        data: {
          pageTitle: 'Race Dashboard'
        }
      })
      .state('organisators.list', {
        url: '',
        templateUrl: 'modules/organisators/client/views/list-organisators.client.view.html',
        controller: 'OrganisatorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Organisators List'
        }
      })
      .state('organisators.create', {
        url: '/create',
        templateUrl: 'modules/organisators/client/views/form-organisator.client.view.html',
        controller: 'OrganisatorsController',
        controllerAs: 'vm',
        resolve: {
          organisatorResolve: newOrganisator
        },
        data: {
          //roles: ['user', 'admin', 'guest'],
          pageTitle : 'Organisators Create'
        }
      })
      .state('organisators.edit', {
        url: '/:organisatorId/edit',
        templateUrl: 'modules/organisators/client/views/form-organisator.client.view.html',
        controller: 'OrganisatorsController',
        controllerAs: 'vm',
        resolve: {
          organisatorResolve: getOrganisator
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Edit Organisator {{ organisatorResolve.name }}'
        }
      })
      .state('organisators.view', {
        url: '/:organisatorId',
        templateUrl: 'modules/organisators/client/views/view-organisator.client.view.html',
        controller: 'OrganisatorsController',
        controllerAs: 'vm',
        resolve: {
          organisatorResolve: getOrganisator
        },
        data:{
          pageTitle: 'Organisator {{ articleResolve.name }}'
        }
      });
  }

  getOrganisator.$inject = ['$stateParams', 'OrganisatorsService'];
  getRace.$inject = ['$stateParams', 'RacesService'];

  function getOrganisator($stateParams, OrganisatorsService) {
    return OrganisatorsService.get({
      organisatorId: $stateParams.organisatorId
    }).$promise;
  }  

  function getRace($stateParams, RacesService) {
    return RacesService.get({
      raceId: $stateParams.raceId
    }).$promise;
  }

  newOrganisator.$inject = ['OrganisatorsService'];

  function newOrganisator(OrganisatorsService) {
    return new OrganisatorsService();
  }
})();
