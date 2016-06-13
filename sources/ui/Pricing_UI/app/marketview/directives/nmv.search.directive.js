angular.module('app.marketview').directive('acctRequired', ['$filter', function ($filter) {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      var prs = scope.search.productType;
      ngModel.$validators.acctRequired = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return isProductTypePrivate(value);
      };

      function isProductTypePrivate(inputValue) {
        if (inputValue != undefined && inputValue !== '') return true;
        for (var i = 0; i < prs.length; i++) {
          var element = prs[i];
          if (element.label === 'FBP' || element.label === 'FBR')
            return false;
        }
        return true;
      }
    }
  };
}]);

