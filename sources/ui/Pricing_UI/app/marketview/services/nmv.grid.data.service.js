'use strict';
(function() {
  angular.module('app.marketview').factory('NmvGridDataService', NmvGridDataService);

  NmvGridDataService.$inject = ['$http','$resource'];

  function NmvGridDataService($http,$resource) {
    var getSearchData = getMockData;
    var service = {
      getSearchData: getSearchData
    };

    return service;

    function getMockData($resource){
      return $resource("/assets/fcData.json");
    }
  }
})();
