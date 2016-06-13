'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcOneDayDataService', TpcOneDayDataService);

  TpcOneDayDataService.$inject = ['$http','TpProperties'];

  function TpcOneDayDataService($http,TpProperties) {
      var getOneDayData = getOneDayData;
    var service = {
      getOneDayData: getOneDayData
    };

    return service;

    function getOneDayData(queryRequest) {
      var config, url;
      url = TpProperties.oneDayGraphDataServiceUrl;
      config = {
        url: url,
        method: 'POST',
        cache:false,
        data: queryRequest
      };
      return $http(config)
        .then(function (response) {
        return response.data;
      }, function (response) {
        // something went wrong
        return 'Oops! There was a problem. Please contact ATPCO Support.';
      });
    }
  }
})();
