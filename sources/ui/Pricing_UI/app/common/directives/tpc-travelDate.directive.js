angular.module('app').directive('dtGreaterThan',['$filter','$parse','$timeout','$log', function ($filter,$parse,$timeout,$log) {
  'use strict';

  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      if (attrs.formName == undefined) {
        throw 'For this directive to function correctly you need to supply the form-name attribute';
      }
      var getter = $parse(attrs.ngModel);
      var value = getter(scope);

      scope.$watch(attrs['ngModel'], function (v) {
        $log.log('value changed, new value is: ' + v);
        value = v;
      });


      if (!isNaN(value) && value != undefined && value !== '') {
        ngModel.$setViewValue(ngModel.$viewValue);
      }
      ngModel.$validators.invalidDate = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return isValidDateStr(value);
      };
      ngModel.$validators.dtGreaterThan = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return isLower(value);
      };

      function isLower(inputValue) {
        var currentDate = $filter('date')(new Date().toISOString().substring(0, 10), 'ddMMMyy');
        var travelDate = $filter('date')(inputValue, 'ddMyy');
        var isValid = isValidDateRange(currentDate,travelDate);
        if (isValid === false) {
          $timeout(function () {
            element[0].focus();
          }, 0, false);
        }
        return isValid;
      }
      var isValidDateStr = function (dateStr) {
        if (dateStr === '' || dateStr === undefined || dateStr.length !== 7) {
          return false;
        }
        return true;
      };

      var isValidDate = function(parsedDate){
        if (isNaN(parsedDate)) {
          return true;
        }
        return false;
      };
      var getDateDifference = function (fromDate, toDate) {
        return (toDate - fromDate);
      };

      var isValidDateRange = function (fromDate, toDate) {
        if (isValidDateStr(fromDate) === true && isValidDateStr(toDate) === true) {
          var parsedFromDate = parseDate(fromDate);
          var parsedToDate = parseDate(toDate);
          if (!isValidDate(parsedFromDate) && !isValidDate(parsedToDate)) {
            var days = getDateDifference(parsedFromDate, parsedToDate);
            if (days < 0) {
              return false;
            }
          }
        }
        return true;
      };
      var parseDate = function(dateStr){
        var day = dateStr.substring(0,2);

        var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
          "AUG", "SEP", "OCT", "NOV", "DEC");

        var month = m_names.indexOf(dateStr.substring(2, 5).toUpperCase());

        var year = dateStr.substring(5,7);
        return Date.parse(new Date(('20'+year),month,day).toISOString());
      }
    }
  };

}]);
