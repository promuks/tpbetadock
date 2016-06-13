'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpSessionService', ['$cookies','ENV','$rootScope', function($cookies, ENV, $rootScope) {
    var service = {
      isSessionExpired: isSessionExpired
    };
    return service;

    function isSessionExpired() {
      if(ENV.local){
        return false;
      }
      if($cookies.get('TP_AUTH')){
        return false;
      }else{
        $rootScope.isSessionexpired=true;
        return true;
      }
    }
  }]);
})();
