'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpAuthService', ['$http','$q','TpProperties','ENV','$rootScope', function($http, $q, TpProperties,ENV,$rootScope) {
    var userProfile = {
      hasAccess:false,
      userName:'',
      isSet:false
    };

    var service = {
      userProfile: userProfile,
      authorize: authorize
    };
    return service;

    function authorize() {
      var deferred = $q.defer();
      $http({
        url: '/fmbootstrap/api/bootstrap/authorize',
        method: 'GET',
        dataType: 'json',
        headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
        // This would return a result when user is authorized.
        TpProperties.populateTpProperties(data.appProperties);
        userProfile.hasAccess=data.canAccess;
        userProfile.userName=data.userName;
        $rootScope.userId=data.userName;
        userProfile.isSet=true;
        deferred.resolve(data);
      }).error(function (data, status, headers, config) {
        // when there are server errors. Can be unAuthorized 401 or other internal server errors
        TpProperties.populateTpProperties(data.appProperties);
        userProfile.hasAccess=false;
        userProfile.userName=data.userName;
        $rootScope.userId=data.userName;
        userProfile.isSet=true;

        if(status === 404){
          /*
           *  Logic to bypass Websphere being up requirement during development
           * */
          if (ENV.local){
            userProfile.hasAccess=true;
            userProfile.userName=data.userName;
            userProfile.isSet=true;
            deferred.resolve({data:data,status:status});
          }else{
            // other server errors unrelated to 401 including 404 in other environments.
            deferred.reject({data:data,status:status});
          }
        }else{
          // For all other server errors including 401 and others
          deferred.reject({data:data,status:status});
        }

      });
      return deferred.promise;
    }
  }]);
})();
