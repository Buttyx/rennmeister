(function () {
  'use strict';

  describe('Participants Route Tests', function () {
    // Initialize global variables
    var $scope,
      ParticipantsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ParticipantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ParticipantsService = _ParticipantsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('participants');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/participants');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ParticipantsController,
          mockParticipant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('participants.view');
          $templateCache.put('modules/participants/client/views/view-participant.client.view.html', '');

          // create mock Participant
          mockParticipant = new ParticipantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Participant Name'
          });

          //Initialize Controller
          ParticipantsController = $controller('ParticipantsController as vm', {
            $scope: $scope,
            participantResolve: mockParticipant
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:participantId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.participantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            participantId: 1
          })).toEqual('/participants/1');
        }));

        it('should attach an Participant to the controller scope', function () {
          expect($scope.vm.participant._id).toBe(mockParticipant._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/participants/client/views/view-participant.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ParticipantsController,
          mockParticipant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('participants.create');
          $templateCache.put('modules/participants/client/views/form-participant.client.view.html', '');

          // create mock Participant
          mockParticipant = new ParticipantsService();

          //Initialize Controller
          ParticipantsController = $controller('ParticipantsController as vm', {
            $scope: $scope,
            participantResolve: mockParticipant
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.participantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/participants/create');
        }));

        it('should attach an Participant to the controller scope', function () {
          expect($scope.vm.participant._id).toBe(mockParticipant._id);
          expect($scope.vm.participant._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/participants/client/views/form-participant.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ParticipantsController,
          mockParticipant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('participants.edit');
          $templateCache.put('modules/participants/client/views/form-participant.client.view.html', '');

          // create mock Participant
          mockParticipant = new ParticipantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Participant Name'
          });

          //Initialize Controller
          ParticipantsController = $controller('ParticipantsController as vm', {
            $scope: $scope,
            participantResolve: mockParticipant
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:participantId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.participantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            participantId: 1
          })).toEqual('/participants/1/edit');
        }));

        it('should attach an Participant to the controller scope', function () {
          expect($scope.vm.participant._id).toBe(mockParticipant._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/participants/client/views/form-participant.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
