'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcMarketsGraphDataService', TpcMarketsGraphDataService);

  TpcMarketsGraphDataService.$inject = ['$http','$log','$q','TpProperties','TpcMarketsGraphsService'];

  function TpcMarketsGraphDataService($http,$log,$q,TpProperties,TpcMarketsGraphsService) {
    var marketsGraphsData = marketsGraphsData;
    var service = {
      marketsGraphsData: marketsGraphsData
    };

    return service;

    function marketsGraphsData(queryRequest) {
      var deferred = $q.defer();
      var config, url;
      url = TpProperties.marketsgraphDataServiceUrl;
      config = {
        url: url,
        method: 'POST',
        cache:false,
        data: queryRequest
      };
      $http(config)
        .then(function (response) {
          deferred.resolve({
            graphConfig: TpcMarketsGraphsService.getMarketsGraphConfig(response.data),
            graphData: response.data
          });
        }, function (response) {
          $log.error("Service is down, please try again later");
          $log.error(response);
          deferred.reject({data:"Service is down, please try again later"});
        });
      return deferred.promise;
    }
  }
})();
