'use strict';

describe('angular reorderable', function () {
  var scope;

  beforeEach(module('angularReorderable'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();

    scope.collection = [
      {
        name: 'Foo',
        rank: 4
      },
      {
        name: 'Bar',
        rank: 3
      },
      {
        name: 'Baz',
        rank: 2
      },
      {
        name: 'Qux',
        rank: 1
      }
    ];
  }))

  describe('Reorderable controller', function () {
    var createController;

    beforeEach(inject(function ($controller) {
      createController = function () {
        var controller = $controller('ReorderableCtrl', {
          $scope: scope
        });

        // Mimic the link function for test purposes.
        controller.collection = scope.collection;
        controller.valueIdentifier = 'item';
        controller.sortKey = 'rank';

        scope.$digest();

        return controller;
      };
    }));

    it('should sort collection', function () {
      var controller = createController();

      expect(scope.collection[0].name).to.equals('Qux');
      expect(scope.collection[1].name).to.equals('Baz');
      expect(scope.collection[2].name).to.equals('Bar');
      expect(scope.collection[3].name).to.equals('Foo');

      scope.collection[0].rank = 100;
      scope.$digest();

      expect(scope.collection[0].name).to.equals('Baz');
      expect(scope.collection[1].name).to.equals('Bar');
      expect(scope.collection[2].name).to.equals('Foo');
      expect(scope.collection[3].name).to.equals('Qux');
    });

    describe('#reorder', function () {
      describe('moving item forward', function () {
        it('should reorder items', function () {
          var controller = createController();

          controller.reorder(scope.collection[0], scope.collection[2]);

          expect(scope.collection[0].name).to.equals('Baz');
          expect(scope.collection[1].name).to.equals('Bar');
          expect(scope.collection[2].name).to.equals('Qux');
          expect(scope.collection[3].name).to.equals('Foo');
        });
      });

      describe('moving item backward', function () {
        it('should reorder items', function () {
          var controller = createController();

          controller.reorder(scope.collection[3], scope.collection[1]);

          expect(scope.collection[0].name).to.equals('Qux');
          expect(scope.collection[1].name).to.equals('Foo');
          expect(scope.collection[2].name).to.equals('Baz');
          expect(scope.collection[3].name).to.equals('Bar');
        });
      });
    });
  });

  describe('Reorderable directive', function () {
    var template, createElement;

    beforeEach(inject(function ($compile) {
      createElement = function () {
        var element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    }));

    describe('#compile', function () {
      it('should throw an exception if ng-repeat is not present on element', function () {
        template = '<div><div reorderable="rank"></div><div>';

        expect(createElement).to.throw('Reorderable error: ngRepeat is not present on element.');
      });

      // ngRepeat format is already tested by AngularJS, if the syntax evolve,
      // it should be reported in the module, but there is no way to test it
      // properly here.
    });

    describe('#link', function () {
      it('should pass values to controller', function () {
        template = '<div><div ng-repeat="item in collection" reorderable="rank"></div><div>';
        var element = createElement();
        // How to get controller from a non existing DOM element ?
      });
    })
  });

  describe('Reorderable handle directive', function () {
    xit('TODO');
  });
});
