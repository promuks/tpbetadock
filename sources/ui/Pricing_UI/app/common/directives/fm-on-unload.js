'use strict';
(function () {
  angular.module('app').directive('fmOnUnload', function ($parse, $window, $cookies,$log,$timeout,$http) {
    return function postLink(scope, $element, attr, ctrls) {
      window.onbeforeunload = function (event) {
        if ($cookies.get('TP_AUTH')) {
          $cookies.remove('TP_AUTH');

          var config, url;
          url = '/fmbootstrap/api/bootstrap/invalidatesession'+'?ts='+new Date();
          config = {
            url: url,
            method: 'GET',
            cache:false
          };
          $http(config)
            .then(function (response) {
              $log.debug('Invalidate call issued');
            }, function (response) {
              $log.error("Error during Invalidate call.");
            });
          $log.info("Invalidating session");
          $timeout(function() {
            $log.info("Timeout occurred");
          }, 10000);

        }
      }
    }
  });
})();



