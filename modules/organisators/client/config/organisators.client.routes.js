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

  function getOrganisator($stateParams, OrganisatorsService) {
    return OrganisatorsService.get({
      organisatorId: $stateParams.organisatorId
    }).$promise;
  }

  newOrganisator.$inject = ['OrganisatorsService'];

  function newOrganisator(OrganisatorsService) {
    return new OrganisatorsService();
  }
})();
