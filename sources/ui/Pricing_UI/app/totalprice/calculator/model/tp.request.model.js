'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('CalculatorRequest', CalculatorRequest);

  CalculatorRequest.$inject = ['CalculatorCriteria', 'owrtOptions','$filter','$rootScope'];

  function CalculatorRequest (CalculatorCriteria, owrtOptions,$filter,$rootScope) {

    var calculatorRequest = {
      travelDateStr: $filter('date')(new Date().toISOString().substring(0, 10), 'ddMMMyy'),
      travelDuration:7,
      shopperDuration:30,
      userId:'',
      oneWay: owrtOptions[0],
      subRequests: []
    };
    calculatorRequest.subRequests.push(new CalculatorCriteria('','','',''));

    if($rootScope.userId!==undefined){
      calculatorRequest.userId = $rootScope.userId;
    }

    return calculatorRequest;

  }
})();
