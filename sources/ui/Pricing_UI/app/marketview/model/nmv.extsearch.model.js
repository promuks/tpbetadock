  'use strict';
  (function() {
      angular.module('app.marketview').controller('MarketviewExtendedSearchModelController', [
          '$scope','search', '$modalInstance',
          function($scope, search, $modalInstance) {
              $scope.search=search;

              $scope.ok = function () {
                  $scope.search.modalRslt=true;
                  $modalInstance.close('true');
              };

              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
          }
      ])

  })();
 