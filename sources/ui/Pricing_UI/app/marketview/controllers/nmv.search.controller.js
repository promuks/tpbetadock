'use strict';
(function () {

  angular.module('app.marketview').controller('MarketviewSearchController' , MarketviewSearchController);

  MarketviewSearchController.$inject = ['MarketviewRequest', 'MarketviewCriteria','productTypeOptionList','$scope','$modal'];

  function MarketviewSearchController(MarketviewRequest,MarketviewCriteria,productTypeOptionList,$scope,$modal) {

    /*jshint validthis: true */
    var vms = this;

    vms.productTypeOptionList=productTypeOptionList;
    vms.$modal=$modal
    vms.mktRequest=MarketviewRequest;
    vms.addSearchRow = addSearchRow;
    vms.copySearchRow = copySearchRow;
    vms.deleteSearchRow = deleteSearchRow;
    vms.logSelection = logSelection;


    function addSearchRow() {
      if (vms.mktRequest.mktSubRequests.length < 5) {
        var newSearchCritria = new MarketviewCriteria();
        vms.mktRequest.mktSubRequests.push(newSearchCritria);
      }
    };

    function  deleteSearchRow(index) {
      if (vms.mktRequest.mktSubRequests.length !== 1) {
        vms.mktRequest.mktSubRequests.splice(index, 1);
      }
    };

    function  copySearchRow(row) {
      var copiedSearchCritria = angular.copy(row);
      copiedSearchCritria.modalRslt = true;//reset
      if (vms.mktRequest.mktSubRequests.length < 5) {
        vms.mktRequest.mktSubRequests.push(copiedSearchCritria);
      }
    };

    $scope.open = function (search) {
        var modalInstance = $modal.open({
          templateUrl: 'marketview/views/extendedsearch.html',
          //templateUrl: '/searchModal',
          controller: 'MarketviewExtendedSearchModelController',
        //  size: size,
          resolve: {
            items: function () {
              return $scope.items;
            },
            search: function () {
              //return $scope.searchRequest.searchCriteria[0];
              return search;
            }
          },
          windowClass: 'app-modal-window'
        });
    }



    function  logSelection(form) {
      if(ENV.debug){
/*        toastr.info(ENV.apiEndpoint);
        toastr.info(vms.mktRequest.owrt.name+':'+vms.mktRequest.firstTravelDate+':'+vms.mktRequest.travelDuration+':'+vms.mktRequest.shopperDuration);
        var count;
        for(count=0; count< vms.mktRequest.mktSubRequests.length;count++){
          toastr.info(vms.mktRequest.mktSubRequests[count].origin+':'+vms.mktRequest.mktSubRequests[count].destination+':'+vms.mktRequest.mktSubRequests[count].carriers+':'+vms.mktRequest.mktSubRequests[count].fareClasses);
        }*/
      }
    };

  }
})();



