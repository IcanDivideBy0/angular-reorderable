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
  }));

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
      createController();

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

    it('should throw an exception if ng-repeat is not present on element', function () {
      template =
        '<ul>' +
        '  <li reorderable="rank"></li>' +
        '</ul>';

      expect(createElement).to.throw('Reorderable error: ngRepeat is not present on element.');
    });

    // ngRepeat format is already tested by AngularJS, if the syntax evolve,
    // it should be reported in the module, but there is no way to test it
    // properly here.
  });

  describe('Reorderable handle directive', function () {
    var template, createElement;

    beforeEach(inject(function ($compile, $document) {
      createElement = function () {
        var element = $compile(template)(scope);

        // We need the element to be in a document to get him well positioned.
        $document.get(0).body.appendChild(element.get(0));

        scope.$digest();
        return element;
      };
    }));

    it('should set items elements positions', function () {
      template =
        '<ul>' +
        '  <li ng-repeat="item in collection" reorderable="rank">' +
        '    <span reorderable-handle ng-bind="item.name"></span>' +
        '  </li>' +
        '</ul>';
      var element = createElement();

      expect(element.find('[reorderable]')).to.have.css('position', 'relative');
    });

    it('should allow to move item forward', inject(function ($document) {
      template =
        '<ul>' +
        '  <li' +
        '   ng-repeat="item in collection"' +
        '   reorderable="rank"' +
        '   reorderable-handle' +
        '   ng-bind="item.name"></li>' +
        '</ul>';
      var element = createElement();

      var dragElement = element.find('[reorderable-handle]:eq(0)');
      var dropElement = element.find('[reorderable]:eq(2)');

      // Click first element.
      dragElement.trigger(jQuery.Event('mousedown', {
        clientX: dragElement.get(0).getBoundingClientRect().left,
        clientY: dragElement.get(0).getBoundingClientRect().top
      }));

      // Move mouse to third element.
      $document.trigger(jQuery.Event('mousemove', {
        clientX: dropElement.get(0).getBoundingClientRect().left,
        clientY: dropElement.get(0).getBoundingClientRect().top
      }));
      scope.$digest();

      // Release mouse button (not really needed, but whatever).
      $document.trigger('mouseup');

      expect(element.find('[reorderable]:eq(0)')).to.have.text('Baz');
      expect(element.find('[reorderable]:eq(1)')).to.have.text('Bar');
      expect(element.find('[reorderable]:eq(2)')).to.have.text('Qux');
      expect(element.find('[reorderable]:eq(3)')).to.have.text('Foo');

      expect(scope.collection[0].name).eql('Baz');
      expect(scope.collection[1].name).eql('Bar');
      expect(scope.collection[2].name).eql('Qux');
      expect(scope.collection[3].name).eql('Foo');
    }));

    it('should not trigger click event after reordering', inject(function ($document) {
      scope.clickSpy = sinon.spy();

      template =
        '<ul>' +
        '  <li' +
        '   ng-repeat="item in collection"' +
        '   reorderable="rank"' +
        '   reorderable-handle' +
        '   ng-bind="item.name"' +
        '   ng-click="clickSpy()"></li>' +
        '</ul>';
      var element = createElement();

      var dragElement = element.find('[reorderable-handle]:eq(0)');

      // Click first element.
      dragElement.trigger(jQuery.Event('mousedown', {
        clientX: dragElement.get(0).getBoundingClientRect().left,
        clientY: dragElement.get(0).getBoundingClientRect().top
      }));

      // Move mouse to third element.
      $document.trigger(jQuery.Event('mousemove', {
        clientX: dragElement.get(0).getBoundingClientRect().left + 10,
        clientY: dragElement.get(0).getBoundingClientRect().top + 10
      }));

      // Release mouse button (not really needed, but whatever).
      $document.trigger('mouseup');

      // Click event if fired right after mouseup event.
      dragElement.trigger('click');

      expect(scope.clickSpy).to.not.have.been.called;
    }));
  });
});
