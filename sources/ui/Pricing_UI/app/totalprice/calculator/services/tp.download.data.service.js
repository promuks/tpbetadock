'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcDownloadDataService', ['$http','TpProperties', function($http,TpProperties) {
    return {
      downloadData: function(queryRequest) {
        var config, url;
        url = TpProperties.marketsgraphDataServiceUrl;
        config = {
          url: url,
          method: 'POST',
          cache:false,
          data: queryRequest
        };
        return $http(config)
        .then(function(response) {
          return  response.data;
        }, function(response) {
          // something went wrong
          return 'Oops! There was a problem. Please contact ATPCO Support.'+response;
        });
      }
    };
  }]);
})();

