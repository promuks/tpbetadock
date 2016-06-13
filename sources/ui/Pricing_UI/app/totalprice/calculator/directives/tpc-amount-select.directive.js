angular.module('app.totalprice.calculator') .directive('tpcAmountSelect', function () {
  'use strict';

  return {
    restrict: 'A',
    replace: true,
    template: ''+
    '<div class="language-select" ng-if="visible">'+
    '<label>'+
    '{{"directives.language-select.Language" | translate}}:'+
    '<select ng-model="currentLocaleDisplayName"'+
    'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"'+
    'ng-change="changeLanguage(currentLocaleDisplayName)">'+
    '</select>'+
    '</label>'+
    '</div>'+
    '',
    controller: function ($scope) {
      $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
      $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
      $scope.visible = $scope.localesDisplayNames &&
        $scope.localesDisplayNames.length > 1;

      $scope.changeLanguage = function (locale) {
        LocaleService.setLocaleByDisplayName(locale);
      };
    }
  };
})
.directive('initFocus', function() {
  var timer;

  return function(scope, elm, attr) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      elm.focus();
    }, 0);
  };
});

