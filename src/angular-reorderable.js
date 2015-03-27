'use strict';

angular
.module('angularReorderable', [])
.controller('ReorderableCtrl', [
  '$scope',
  function ReorderableCtrl($scope) {
    this.collection = null;
    this.valueIdentifier = null;
    this.sortKey = null;

    $scope.$watchCollection(_.bind(function () {
      return _.pluck(this.collection, this.sortKey);
    }, this), _.bind(function () {
      if (!_.isArray(this.collection)) return;

      var sortedCollection = _.sortBy(this.collection, this.sortKey);
      this.collection.length = 0;
      this.collection.push.apply(this.collection, sortedCollection);
    }, this));

    this.reorder = function (srcItem, destItem) {
      var sort = 0;

      if (srcItem[this.sortKey] > destItem[this.sortKey]) {
        this.collection.forEach(_.bind(function (item) {
          if (item[this.sortKey] === srcItem[this.sortKey]) return;
          if (item[this.sortKey] === destItem[this.sortKey]) srcItem[this.sortKey] = sort ++;
          item[this.sortKey] = sort ++;
        }, this));
      } else {
        this.collection.forEach(_.bind(function (item) {
          if (item[this.sortKey] === srcItem[this.sortKey]) return;
          item[this.sortKey] = sort ++;
          if (item[this.sortKey] === destItem[this.sortKey]) srcItem[this.sortKey] = sort ++;
        }, this));
      }

      $scope.$digest();
    };

    this.emit = function(event) {
      $scope.$emit(event);
    }
  }
])
.directive('reorderable', [
  function () {
    return {
      restrict: 'A',
      controller: 'ReorderableCtrl',
      priority: 2000, // Get a higher priority than ngRepeat (eg. 1000).
      compile: function ($tEelement, $attr) {
        var expression = $attr.ngRepeat;
        if (!expression) throw new Error('Reorderable error: ngRepeat is not present on element.');

        // Use ngRepeat match to get the watched expression.
        var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

        var lhs = match[1];
        var rhs = match[2];

        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

        // ngRepeat will throw its own exception in this case.
        if (!rhs) return;

        var valueIdentifier = match[3] || match[1];

        return function reorderableLink($scope, $element, $attr, ctrl) {
          // Setup controller values.
          ctrl.valueIdentifier = valueIdentifier;
          ctrl.sortKey = $attr.reorderable;

          $scope.$watch(rhs, function (collection) {
            ctrl.collection = collection;
          });
        };
      }
    };
  }
])
.directive('reorderableHandle', [
  '$document',
  function ($document) {
    return {
      restrict: 'A',
      require: '^reorderable',
      link: function reorderableHandle(scope, element, attr, ReorderableCtrl) {
        var itemElement = element.closest('[reorderable]');
        var item = itemElement.scope()[ReorderableCtrl.valueIdentifier];
        var isDragging;

        var startX = 0, startY = 0, elementX = 0, elementY = 0;

        itemElement.css({
          position: 'relative'
        });

        element.on('click', function (event) {
          if (isDragging) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
          }
        });

        element.on('mousedown', function (event) {
          if (itemElement.attr('readonly')) return;

          // Prevent default dragging of selected content
          event.preventDefault();
          isDragging = false;

          // Put element on foreground.
          itemElement.css({ zIndex: 10 });

          // Start dragging.
          startY = event.clientY;
          startX = event.clientX;
          elementY = itemElement.get(0).getBoundingClientRect().top;
          elementX = itemElement.get(0).getBoundingClientRect().left;

          // Set mouse events handlers.
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        /**
         * Mouse move handler
         */

        function mousemove(event) {
          // Once we started dragging element, prevent click to being fired.
          isDragging = true;

          // Get the collection's element under mouse position.
          var hoverItem = getItemFromPoint(event.clientX, event.clientY);

          if (hoverItem) {
            ReorderableCtrl.reorder(item, hoverItem);

            itemElement.css({ top: '', left: '' });

            var top = itemElement.get(0).getBoundingClientRect().top;
            var left = itemElement.get(0).getBoundingClientRect().left;

            startY += top - elementY;
            startX += left - elementX;
            elementY = top;
            elementX = left;
          }

          itemElement.css({
            top: (event.clientY - startY) + 'px',
            left: (event.clientX - startX) + 'px'
          });
        }

        /**
         * Remove mouse events listeners and reset custom styles.
         */

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);

          ReorderableCtrl.emit('reorderEnd')

          itemElement.css({
            top: '',
            left: '',
            zIndex: ''
          });
        }

        /**
         * Retrives the collection item at (x, y) coordinates.
         */

        function getItemFromPoint(x, y) {
          var hoverItem = null;

          // Move current element on background.
          element.closest('[reorderable]').css({ zIndex: -1 });

          var hoverElement = angular.element($document.get(0).elementFromPoint(x, y)).closest('[reorderable]');

          if (hoverElement.length) {
            hoverItem = hoverElement.scope()[ReorderableCtrl.valueIdentifier];

            if (item[ReorderableCtrl.sortKey] === hoverItem[ReorderableCtrl.sortKey])
              hoverItem = null;
          }

          // Put back current element on foreground.
          element.closest('[reorderable]').css({ zIndex: 10 });

          return hoverItem;
        }
      }
    };
  }
]);
