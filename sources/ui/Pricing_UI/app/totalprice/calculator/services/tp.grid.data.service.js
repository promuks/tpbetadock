'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcGridDataService', TpcGridDataService);

  TpcGridDataService.$inject = ['$http','$q','$log','TpProperties'];

  function TpcGridDataService($http,$q,$log,TpProperties) {
    var getFareClassesData = getFareClassesData;
    var service = {
      getFareClassesData: getFareClassesData
    };

    return service;

    function getFareClassesData(queryRequest) {
      var deferred = $q.defer();
      var config, url;
      url = TpProperties.gridDataServiceUrl+'?ts='+new Date(),+'?ts='+new Date();
      config = {
        url: url,
        method: 'POST',
        cache:false,
        data: queryRequest
      };
      $http(config)
        .then(function (response) {
          deferred.resolve(response.data);
        }, function (response) {
          $log.error("Service is down, please try again later");
          $log.error(response);
          deferred.reject({data:"Service is down, please try again later"});
        });
      return deferred.promise;
    }
  }
})();
