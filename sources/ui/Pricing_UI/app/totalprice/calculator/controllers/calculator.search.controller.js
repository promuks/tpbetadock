'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('CalculatorSearchController' , CalculatorSearchController);

  CalculatorSearchController.$inject = ['TpSessionService','$state','TpcMessageService','CalculatorRequest', 'CalculatorCriteria' ,'ENV' ,'owrtOptions','TpcPleaseWaitService','$scope','$q','$rootScope'];

  function CalculatorSearchController(TpSessionService,$state,TpcMessageService,CalculatorRequest,CalculatorCriteria, ENV, owrtOptions,TpcPleaseWaitService,$scope,$q,$rootScope) {

    /*jshint validthis: true */
    var vms = this;
    var canSubmit = false;

    vms.owrtOptions=owrtOptions;
    vms.tpcRequest=CalculatorRequest;
    vms.addSearchRow = addSearchRow;
    vms.copySearchRow=copySearchRow;
    vms.deleteSearchRow = deleteSearchRow;
    vms.logSelection = logSelection;
    vms.pleaseWaitLoad = null;
    vms.messageService = TpcMessageService;
    vms.messageService.errorMessages = TpcMessageService.getErrorMessages();
    vms.messageService.accordion = TpcMessageService.getAccordions();

    function addSearchRow() {
      if (vms.tpcRequest.subRequests.length < 5) {
        var newSearchCritria = new CalculatorCriteria();
        vms.tpcRequest.subRequests.push(newSearchCritria);
        }
    };

    function copySearchRow(row) {
      if (vms.tpcRequest.subRequests.length < 5) {
        var copiedSearchCritria = angular.copy(row);
        vms.tpcRequest.subRequests.push(copiedSearchCritria);
      }
    };

    function  deleteSearchRow(index) {
      if (vms.tpcRequest.subRequests.length !== 1) {
        vms.tpcRequest.subRequests.splice(index, 1);
      }
    };

    function  logSelection(route) {
      if(!TpSessionService.isSessionExpired()){
        TpcMessageService.resetMessages();
        vms.pleaseWaitLoadDeferred = TpcPleaseWaitService.createNewDeferred();
        vms.pleaseWaitLoad = vms.pleaseWaitLoadDeferred.promise;
      }
      $state.go(route);
    };

    $scope.$on('resolve-please-wait', function(event, args) {
      if(vms.pleaseWaitLoadDeferred !== undefined) {
        vms.pleaseWaitLoadDeferred.resolve();
      }
     });
  }
})();
