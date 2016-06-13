(function () {
  "use strict";

  angular
    .module('app.common')
    .factory('LookupDataService', LookupDataService);

  LookupDataService.$inject = ['$http','$cacheFactory','$q','$log','TpProperties'];

  /* @ngInject */
  function LookupDataService($http,$cacheFactory,$q,$log,TpProperties) {
    var service = {
      lookupData : getLookupData,
      lookupDataFromCache : getLookupDataFromCache
    };

    return service;

    //////////////// TEST Comment

    function getLookupData(lookupType) {
      var dataCache = getDirectoryLookupCache();
      var deferred = $q.defer();
      var data = dataCache.get(lookupType);
      if (data){
        $log.log("Getting data from cache");
        deferred.resolve({data:data});
      } else{
        $http({
          url: TpProperties.directoryLookupServiceUrl+lookupType+'?ts='+new Date(),
          method: 'GET',
          crossDomain: true,
          timeout: 10000
        }).then(function (response) {
          data = response.data;
          dataCache.put(lookupType, data);
          deferred.resolve({data:data});
          $log.log("Populating directoryLookupCache for LookupType:::"+lookupType);
        },function(response){
          $log.error(response.status);
          deferred.reject({data:"service is down, please try again later"});
        });
      }
      return deferred.promise;
    }

    function getLookupDataFromCache(lookupType) {
      var dataCache = getDirectoryLookupCache();
      var data = dataCache.get(lookupType);
      return data;
    }

    function getDirectoryLookupCache(){
      var cacheName='directoryLookupCache';
      var dataCache = $cacheFactory.get(cacheName);
      if (!dataCache){
        dataCache = $cacheFactory(cacheName);
      }
      return dataCache;
    }

  }


})();


