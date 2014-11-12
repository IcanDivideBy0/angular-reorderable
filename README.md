#### Install
    
```sh
bower install --save angular-reorderable
```

#### Usage

```html
<ul class="list-group">
  <li ng-repeat="person in persons as coll" reorderable="rank" reorderable-handle class="list-group-item">
    <img class="img-circle" ng-src="{{person.picture.thumbnail}}" />
    {{person.name.first}} {{person.name.last}}
  </li>
</ul>
```

#### Demo

here
