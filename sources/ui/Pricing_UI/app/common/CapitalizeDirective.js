'use strict';
(function() {

  angular.module('app').directive('capitalize', function(uppercaseFilter, $parse) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          var capitalized = angular.uppercase(inputValue);
          if(capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        };
        var model = $parse(attrs.ngModel);
        modelCtrl.$parsers.push(capitalize);
        capitalize(model(scope));
      }
    };
  });
})();
