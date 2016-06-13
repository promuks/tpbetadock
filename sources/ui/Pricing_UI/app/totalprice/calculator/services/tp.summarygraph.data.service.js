'use strict';
(function () {
  "use strict";

  angular
    .module('app.totalprice.calculator')
    .factory('TpcSummaryDataService', TpcSummaryDataService);

  TpcSummaryDataService.$inject = ['$http','$log','$q','TpProperties','TpcSummaryGraphService'];

  /* @ngInject */
  function TpcSummaryDataService($http,$log,$q,TpProperties,TpcSummaryGraphService) {

    var service = {
      tpsGraphData : tpsGraphData
    };

    return service;


    function tpsGraphData (queryRequest) {
      var deferred = $q.defer();
       var url = TpProperties.summarygraphDataServiceUrl;
      $http({
        url: url,
        method: 'POST',
        data: queryRequest
      }).then(function (response) {
        deferred.resolve( {
          graphConfig: TpcSummaryGraphService.getSummaryGraphConfig(response.data),
          graphData: response.data
        });
      },function(response){
        $log.error("Service is down, please try again later");
        $log.error(response);
        deferred.reject({data:"Service is down, please try again later"});
      });
      return deferred.promise;
    }

  }
})();
