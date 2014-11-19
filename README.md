[![Build Status](https://travis-ci.org/IcanDivideBy0/angular-reorderable.svg?branch=master)](https://travis-ci.org/IcanDivideBy0/angular-reorderable)

#### Install
    
```sh
bower install --save angular-reorderable
```

#### Usage

Reordering items in `$scope.collection` based on `item.rank` proterty:

```html
<ul>
  <li
   ng-repeat="item in collection"
   reorderable="rank"
   reorderable-handle> [...] </li>
</ul>
```

#### Demo

here
