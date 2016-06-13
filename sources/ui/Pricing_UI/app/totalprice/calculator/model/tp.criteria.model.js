'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('CalculatorCriteria',[function () {


    /**
     * Constructor, with class name
     */
    function CalculatorCriteria(origin,destination,carriers,fareClasses) {
      this.origin=origin;
      this.destination=destination;
      this.carrier=carriers;
      this.fareClasses=fareClasses;
    }

    return CalculatorCriteria;

  }]);
})();
