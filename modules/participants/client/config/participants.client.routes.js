(function () {
  'use strict';

  angular
    .module('participants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('participants', {
        abstract: true,
        url: '/participants',
        template: '<ui-view/>'
      })
      .state('participants.list', {
        url: '',
        templateUrl: 'modules/participants/client/views/list-participants.client.view.html',
        controller: 'ParticipantsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Participants List'
        }
      })
      .state('participants.create', {
        url: '/create',
        templateUrl: 'modules/participants/client/views/form-participant.client.view.html',
        controller: 'ParticipantsController',
        controllerAs: 'vm',
        resolve: {
          participantResolve: newParticipant
        },
        data: {
          pageTitle : 'Participants Create'
        }
      })
      .state('participants.edit', {
        url: '/:participantId/edit',
        templateUrl: 'modules/participants/client/views/form-participant.client.view.html',
        controller: 'ParticipantsController',
        controllerAs: 'vm',
        resolve: {
          participantResolve: getParticipant
        },
        data: {
          pageTitle: 'Edit Participant {{ participantResolve.name }}'
        }
      })
      .state('participants.view', {
        url: '/:participantId',
        templateUrl: 'modules/participants/client/views/view-participant.client.view.html',
        controller: 'ParticipantsController',
        controllerAs: 'vm',
        resolve: {
          participantResolve: getParticipant
        },
        data:{
          pageTitle: 'Participant {{ articleResolve.name }}'
        }
      })
      .state('participants.tracker', {
        url: '/:participantId/tracker/:raceId',
        templateUrl: 'modules/participants/client/views/tracker-participant.client.view.html',
        controller: 'TrackerController',
        controllerAs: 'vm',
        resolve: {
          participantResolve: getParticipant,
          raceResolve: getRace
        },
        data:{
          pageTitle: 'Tracker for {{ articleResolve.name }}'
        }
      });
  }

  getParticipant.$inject = ['$stateParams', 'ParticipantsService'];
  getRace.$inject = ['$stateParams', 'RacesService'];

  function getParticipant($stateParams, ParticipantsService) {
    return ParticipantsService.get({
      participantId: $stateParams.participantId
    }).$promise;
  }  

  function getRace($stateParams, RacesService) {
    return RacesService.get({
      raceId: $stateParams.raceId
    }).$promise;
  }

  newParticipant.$inject = ['ParticipantsService'];

  function newParticipant(ParticipantsService) {
    return new ParticipantsService();
  }
})();
