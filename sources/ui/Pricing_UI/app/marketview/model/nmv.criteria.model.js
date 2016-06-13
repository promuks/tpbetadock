'use strict';
(function() {
  angular.module('app.marketview').factory('MarketviewCriteria',[function () {


    /**
     * Constructor, with class name
     */
    function MarketviewCriteria(origin,destination,carriers,fareClasses) {
      this.origin=origin;
      this.destination=destination;
      this.carriers=carriers;
      this.fareClasses=fareClasses;
    }

    return MarketviewCriteria;

  }]);
})();
