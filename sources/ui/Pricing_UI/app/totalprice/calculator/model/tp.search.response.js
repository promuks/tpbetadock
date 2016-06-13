'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpSearchResponse',[function () {

    /**
     * Constructor, with class name
     */
    function TpSearchResponse(queryId) {
      this.queryId=queryId;
     }

    return TpSearchResponse;

  }]);
})();
