angular.module('app.totalprice.calculator')
.directive('fmResize', function ($window) {
  return function (scope, element) {
    var w = angular.element($window);
    scope.getWindowDimensions = function () {
      return {
        'h': w.height(),
        'w': w.width()
      };
    };
    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;

      scope.style = function () {
        return {
          'height': (newValue.h - 50) + 'px'
        };
      };

    }, true);

    w.bind('resize', function () {
      if (!scope.$$phase){
        scope.$apply();
      }
    });
  }
});

