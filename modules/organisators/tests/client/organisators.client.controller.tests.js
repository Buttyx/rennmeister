(function () {
  'use strict';

  describe('Organisators Controller Tests', function () {
    // Initialize global variables
    var OrganisatorsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      OrganisatorsService,
      mockOrganisator;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _OrganisatorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      OrganisatorsService = _OrganisatorsService_;

      // create mock Organisator
      mockOrganisator = new OrganisatorsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Organisator Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Organisators controller.
      OrganisatorsController = $controller('OrganisatorsController as vm', {
        $scope: $scope,
        organisatorResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleOrganisatorPostData;

      beforeEach(function () {
        // Create a sample Organisator object
        sampleOrganisatorPostData = new OrganisatorsService({
          name: 'Organisator Name'
        });

        $scope.vm.organisator = sampleOrganisatorPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (OrganisatorsService) {
        // Set POST response
        $httpBackend.expectPOST('api/organisators', sampleOrganisatorPostData).respond(mockOrganisator);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Organisator was created
        expect($state.go).toHaveBeenCalledWith('organisators.view', {
          organisatorId: mockOrganisator._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/organisators', sampleOrganisatorPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Organisator in $scope
        $scope.vm.organisator = mockOrganisator;
      });

      it('should update a valid Organisator', inject(function (OrganisatorsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/organisators\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('organisators.view', {
          organisatorId: mockOrganisator._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (OrganisatorsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/organisators\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Organisators
        $scope.vm.organisator = mockOrganisator;
      });

      it('should delete the Organisator and redirect to Organisators', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/organisators\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('organisators.list');
      });

      it('should should not delete the Organisator and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
