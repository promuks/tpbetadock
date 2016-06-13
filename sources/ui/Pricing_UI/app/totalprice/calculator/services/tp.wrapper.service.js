(function () {
  "use strict";


  angular
    .module('app.totalprice.calculator')
    .factory('TpCalculatorWrapperService', TpCalculatorWrapperService);

  TpCalculatorWrapperService.$inject = ['$http','$log','$q','TpProperties'];

  /* @ngInject */
  function TpCalculatorWrapperService($http,$log,$q,TpProperties) {

    var service = {
      processData : process,
      getSearchStatus : getSearchStatus
    };

    return service;


    function process (queryRequest) {
      var deferred = $q.defer();
      $http({
        url: TpProperties.calcWrapperServiceUrl,
        method: 'POST',
        cache:false,
        data: queryRequest
      }).then(function (response) {
        var queryId = response.data;
        deferred.resolve({data:queryId});
      },function(response){
        $log.error("Service is down, please try again later");
        $log.error(response);
        deferred.reject({data:"Service is down, please try again later"});
      });
      return deferred.promise;
    }

    function getSearchStatus(queryId) {
      var config, url;
      url = TpProperties.headerStatusServiceUrl+queryId+'?ts='+new Date();
      config = {
        url: url,
        cache:false,
        method: 'GET'
      };

      return $http(config);
    }

  }


})();
