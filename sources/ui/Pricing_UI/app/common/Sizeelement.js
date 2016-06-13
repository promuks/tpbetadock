'use strict';
(function() {
  angular.module('app').directive('sizeelement', function ($window) {
    return{
      scope:true,
      priority: 0,
      link: function (scope, element) {
        scope.$watch(function(){
           return $window.innerHeight;
        },
          function(newValue, oldValue) {
          scope.height=$window.innerHeight-100;
        });
      }}
  });
})();
