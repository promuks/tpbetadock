
(function () {
  angular.module('app.totalprice.calculator').factory('TpcPleaseWaitService', TpcPleaseWaitService);

  TpcPleaseWaitService.$inject = ['$q','$log','$rootScope'];

  function TpcPleaseWaitService($q,$log,$rootScope) {

    var createNewDeferred = createNewDeferred;
    var broadCastEventWithName = broadCastEventWithName;
    var currentPleaseWaitDeferred  = null;

    var service = {
      createNewDeferred: createNewDeferred,
      broadCastEventWithName:broadCastEventWithName
    };
    return service;

    function createNewDeferred() {
      currentPleaseWaitDeferred = $q.defer();
      $log.log("created new promise ::::::::::" + currentPleaseWaitDeferred);
      return currentPleaseWaitDeferred;
    }

    function broadCastEventWithName(eventName){
      $log.log("Notify ::::::::::" + currentPleaseWaitDeferred);
      $rootScope.$broadcast(eventName, {currentPleaseWaitDeferred : currentPleaseWaitDeferred});
    }
  }
})();
