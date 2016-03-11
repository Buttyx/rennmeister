(function () {
  'use strict';

  describe('Trackinginfos Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrackinginfosService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrackinginfosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrackinginfosService = _TrackinginfosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trackinginfos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trackinginfos');
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
          TrackinginfosController,
          mockTrackinginfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trackinginfos.view');
          $templateCache.put('modules/trackinginfos/client/views/view-trackinginfo.client.view.html', '');

          // create mock Trackinginfo
          mockTrackinginfo = new TrackinginfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trackinginfo Name'
          });

          //Initialize Controller
          TrackinginfosController = $controller('TrackinginfosController as vm', {
            $scope: $scope,
            trackinginfoResolve: mockTrackinginfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trackinginfoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trackinginfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trackinginfoId: 1
          })).toEqual('/trackinginfos/1');
        }));

        it('should attach an Trackinginfo to the controller scope', function () {
          expect($scope.vm.trackinginfo._id).toBe(mockTrackinginfo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trackinginfos/client/views/view-trackinginfo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrackinginfosController,
          mockTrackinginfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trackinginfos.create');
          $templateCache.put('modules/trackinginfos/client/views/form-trackinginfo.client.view.html', '');

          // create mock Trackinginfo
          mockTrackinginfo = new TrackinginfosService();

          //Initialize Controller
          TrackinginfosController = $controller('TrackinginfosController as vm', {
            $scope: $scope,
            trackinginfoResolve: mockTrackinginfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trackinginfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trackinginfos/create');
        }));

        it('should attach an Trackinginfo to the controller scope', function () {
          expect($scope.vm.trackinginfo._id).toBe(mockTrackinginfo._id);
          expect($scope.vm.trackinginfo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trackinginfos/client/views/form-trackinginfo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrackinginfosController,
          mockTrackinginfo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trackinginfos.edit');
          $templateCache.put('modules/trackinginfos/client/views/form-trackinginfo.client.view.html', '');

          // create mock Trackinginfo
          mockTrackinginfo = new TrackinginfosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trackinginfo Name'
          });

          //Initialize Controller
          TrackinginfosController = $controller('TrackinginfosController as vm', {
            $scope: $scope,
            trackinginfoResolve: mockTrackinginfo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trackinginfoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trackinginfoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trackinginfoId: 1
          })).toEqual('/trackinginfos/1/edit');
        }));

        it('should attach an Trackinginfo to the controller scope', function () {
          expect($scope.vm.trackinginfo._id).toBe(mockTrackinginfo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trackinginfos/client/views/form-trackinginfo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
