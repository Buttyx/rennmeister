(function () {
  'use strict';

  angular
    .module('trackinginfos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trackinginfos', {
        abstract: true,
        url: '/trackinginfos',
        template: '<ui-view/>'
      })
      .state('trackinginfos.list', {
        url: '',
        templateUrl: 'modules/trackinginfos/client/views/list-trackinginfos.client.view.html',
        controller: 'TrackinginfosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trackinginfos List'
        }
      })
      .state('trackinginfos.create', {
        url: '/create',
        templateUrl: 'modules/trackinginfos/client/views/form-trackinginfo.client.view.html',
        controller: 'TrackinginfosController',
        controllerAs: 'vm',
        resolve: {
          trackinginfoResolve: newTrackinginfo
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle : 'Trackinginfos Create'
        }
      })
      .state('trackinginfos.edit', {
        url: '/:trackinginfoId/edit',
        templateUrl: 'modules/trackinginfos/client/views/form-trackinginfo.client.view.html',
        controller: 'TrackinginfosController',
        controllerAs: 'vm',
        resolve: {
          trackinginfoResolve: getTrackinginfo
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Edit Trackinginfo {{ trackinginfoResolve.name }}'
        }
      })
      .state('trackinginfos.view', {
        url: '/:trackinginfoId',
        templateUrl: 'modules/trackinginfos/client/views/view-trackinginfo.client.view.html',
        controller: 'TrackinginfosController',
        controllerAs: 'vm',
        resolve: {
          trackinginfoResolve: getTrackinginfo
        },
        data:{
          pageTitle: 'Trackinginfo {{ articleResolve.name }}'
        }
      });
  }

  getTrackinginfo.$inject = ['$stateParams', 'TrackinginfosService'];

  function getTrackinginfo($stateParams, TrackinginfosService) {
    return TrackinginfosService.get({
      trackinginfoId: $stateParams.trackinginfoId
    }).$promise;
  }

  newTrackinginfo.$inject = ['TrackinginfosService'];

  function newTrackinginfo(TrackinginfosService) {
    return new TrackinginfosService();
  }
})();
