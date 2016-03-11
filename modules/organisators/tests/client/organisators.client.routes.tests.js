(function () {
  'use strict';

  describe('Organisators Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrganisatorsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrganisatorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrganisatorsService = _OrganisatorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('organisators');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/organisators');
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
          OrganisatorsController,
          mockOrganisator;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('organisators.view');
          $templateCache.put('modules/organisators/client/views/view-organisator.client.view.html', '');

          // create mock Organisator
          mockOrganisator = new OrganisatorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organisator Name'
          });

          //Initialize Controller
          OrganisatorsController = $controller('OrganisatorsController as vm', {
            $scope: $scope,
            organisatorResolve: mockOrganisator
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:organisatorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.organisatorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            organisatorId: 1
          })).toEqual('/organisators/1');
        }));

        it('should attach an Organisator to the controller scope', function () {
          expect($scope.vm.organisator._id).toBe(mockOrganisator._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/organisators/client/views/view-organisator.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrganisatorsController,
          mockOrganisator;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('organisators.create');
          $templateCache.put('modules/organisators/client/views/form-organisator.client.view.html', '');

          // create mock Organisator
          mockOrganisator = new OrganisatorsService();

          //Initialize Controller
          OrganisatorsController = $controller('OrganisatorsController as vm', {
            $scope: $scope,
            organisatorResolve: mockOrganisator
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.organisatorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/organisators/create');
        }));

        it('should attach an Organisator to the controller scope', function () {
          expect($scope.vm.organisator._id).toBe(mockOrganisator._id);
          expect($scope.vm.organisator._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/organisators/client/views/form-organisator.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrganisatorsController,
          mockOrganisator;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('organisators.edit');
          $templateCache.put('modules/organisators/client/views/form-organisator.client.view.html', '');

          // create mock Organisator
          mockOrganisator = new OrganisatorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Organisator Name'
          });

          //Initialize Controller
          OrganisatorsController = $controller('OrganisatorsController as vm', {
            $scope: $scope,
            organisatorResolve: mockOrganisator
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:organisatorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.organisatorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            organisatorId: 1
          })).toEqual('/organisators/1/edit');
        }));

        it('should attach an Organisator to the controller scope', function () {
          expect($scope.vm.organisator._id).toBe(mockOrganisator._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/organisators/client/views/form-organisator.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
