'use strict';
(function() {
    angular.module('app.marketview').controller('MarketviewExtendedSearchController', [
        '$scope', '$modal', '$log',
        function($scope, $modal, $log) {

            $scope.open = function (size) {

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'MarketviewExtendedSearchModelController',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ])
})();


