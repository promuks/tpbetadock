'use strict';

angular
  .module('app.totalprice.calculator')
  .config(config);



function config($stateProvider, $urlRouterProvider) {
  var modalInstance;
  var route;
 // var firstTime =true;
  var fcData;

  $stateProvider
    // START: TPC SEARCH View //
    .state('root.tpcalc', {
      url: 'tpcalc',
      templateUrl: 'totalprice/calculator/views/home.html',
      /*controller: 'TpcCalcCtrl'*/
      controller: 'CalculatorController',
      controllerAs: 'vm',
      resolve: {
        //  This is to invoke the authorization call.
        auth: function($q, TpAuthService,$rootScope) {
          $rootScope.authorized=false;
          if($rootScope.isAuthorized === undefined){
            var deferred = $q.defer();
            TpAuthService.authorize().then(function(data,status) {
              /*
               * The callback here would be on three cases.
               * 1. if the user is authorized.
               * 2. If user is in development mode and does  not require authorization
               * */
              /*if (data.canAccess === false) {
               // Case 2. unauthorized
               $rootScope.isAuthorized = false;
               deferred.reject();
               } else */
              $rootScope.authorized=true;
              if (data.canAccess === true) {
                // Case 1. authorized
                $rootScope.isAuthorized = true;
                deferred.resolve();
              } else{
                // Case 3: in development mode
                $rootScope.isAuthorized = true;
                deferred.resolve(); // bypassing
              }
            },function(error){
              /*
               * The callback here would be on two cases.
               * 1. if the user is unauthorized.
               * 2. If server has issues other than 401(not authorized.).i.e server errors
               * */
              if(error.status===401){
                $rootScope.isAuthorized = false;
                //$state.go('unauthorized');
              }else{
                //$state.go('internalerror');
              }
              deferred.reject({data:error.data,status:error.status});
            });
            return deferred.promise;
          }else{
            return '';
          }
        },
        LookupDataService:LookupDataPrepService
      }
    })
    // END: TPC SEARCH View //

     // START: TPC SEARCH View //
    .state('root.tpcalc.search', {
      url: '/search',
      templateUrl: 'totalprice/calculator/views/search.html',
      controller: 'CalculatorSearchController',
      controllerAs: 'vms',
      resolve:{
        TpSearchService:TpSearchService
      }
    })
  // END: TPC SEARCH View //

    // START: TPC RESULT View //
    .state('root.tpcalc.result', {
      url: '/result',
      templateUrl: 'totalprice/calculator/views/result.html',
      controller: 'CalculatorGraphController',
      controllerAs: 'vmg',
      resolve: {
        SummaryConfigPrepService:SummaryConfigPrepService
      }
    })
    // END: TPC RESULT View //


   // START: TPC Grid Results //
    .state('root.tpcalc.gridresult', {
      parent: 'root.tpcalc.result',
      url: '/gridresult',
      controller: 'CalculatorGridController',
      controllerAs: 'vmgr',
      onEnter: ['$stateParams', '$state', '$modal','$log', function ($stateParams, $state, $modal,$log) {
        $log.log('Open modal');
        route = $state.current.name;
        modalInstance = $modal.open({
          templateUrl: 'totalprice/calculator/views/gridresult.html',
          backdrop: 'static',
          resolve: {
            GridConfigPrepService: GridConfigPrepService
          },
          windowClass: 'large-Modal'
        })
        modalInstance.result.finally(function () {
          //modalInstance = null;
          if ($state.current.name === 'root.tpcalc.gridresult')
            $state.go(route, null, { reload: true });
        });
      }],
      onExit: function() {
        if (modalInstance) {
          modalInstance.close();
        }
      }
    })

    // END: TPC Grid RESULT View //

    // START: TPC Grid Chart //
    .state('root.tpcalc.marketsgraphs', {
      url: '/marketsgraphs',
      templateUrl: 'totalprice/calculator/views/marketsgraphs.html',
      controller: 'MarketsGraphsController',
      controllerAs: 'vmmg',
      resolve: {
        MarketsConfigPrepService: MarketsConfigPrepService
      }
    })

    // START: TPC Grid Results //
    .state('root.tpcalc.FCSelectFromMarketGraphs', {
      parent: 'root.tpcalc.marketsgraphs',
      url: '/gridresultFromGrapsh',
      controller: 'CalculatorGridController',
      controllerAs: 'vmgr',
      onEnter: ['$stateParams', '$state', '$modal','$log', function ($stateParams, $state, $modal,$log) {
        $log.log('Open modal');
        route = $state.current.name;
        modalInstance = $modal.open({
          templateUrl: 'totalprice/calculator/views/gridresult.html',
          backdrop: 'static',
          resolve: {
            GridConfigPrepService: GridConfigPrepService
          },
          windowClass: 'large-Modal'
        })
        modalInstance.result.finally(function () {
         // modalInstance = null;
         if ($state.current.name === 'root.tpcalc.FCSelectFromMarketGraphs') {
           $state.go(route, null, { reload: true });
         }else{
           $state.transitionTo($state.current, angular.copy($stateParams), { reload: true, inherit: true, notify: true });
         }
        });
      }],
      onExit: function() {
        if (modalInstance) {
          modalInstance.close();
        }
      }
    });
  // END: TPC Grid RESULT View //


SummaryConfigPrepService.$inject= ['$state','TpcPleaseWaitService','TpcMessageService','TpHelperService','TpcSummaryDataService','SummaryFilters','TpcOneDayGraphConfig','TpGridService','CalculatorRequest','TpCalculatorWrapperService','$log','$timeout','$q','TpSearchResponse'];
function SummaryConfigPrepService($state,TpcPleaseWaitService,TpcMessageService,TpHelperService,TpcSummaryDataService,SummaryFilters,TpcOneDayGraphConfig,TpGridService,CalculatorRequest,TpCalculatorWrapperService,$log,$timeout,$q,TpSearchResponse){
  //initialize grid
  TpGridService.firstTime = true;
  TpcOneDayGraphConfig.oneDayChartConfig.showOneDayGraph = false;
  TpcOneDayGraphConfig.oneDayChartConfig.graphData = [];
  var deferred = $q.defer();
  $log.log("Query Id ::::::" + TpSearchResponse.queryId);

  function performErrorHandling(){
    TpSearchResponse.queryId = null;
    TpcMessageService.addInternalErrorMessage();
    TpcPleaseWaitService.broadCastEventWithName('resolve-please-wait');
    deferred.reject();
    $state.go('root.tpcalc.search');
  }

  function freeResources(){
    TpcPleaseWaitService.broadCastEventWithName('resolve-please-wait');
  }

  function getStatus(response){
    TpSearchResponse.queryId = response.data.queryId;
    TpCalculatorWrapperService.getSearchStatus(response.data.queryId).then(function (status) {
      $log.log('STATUS:::' + status.data.status);
      if (status.data.status === 'COMPLETE') {
        deferred.resolve(response.data.queryId);
      } else if (status.data.status === 'ERROR') {
        deferred.reject(response);
      } else {
        $log.log('polling for status:::');
        $timeout(function () {
          getStatus(response)
        }, 2000);
      }
    },function(response){
      deferred.reject(response);
    })
    return deferred.promise;
   };

    function getGraphData(queryId){
      var queryObj = TpHelperService.createQueryParamsFromOptions(queryId, [], SummaryFilters.cabinOptions);
      return TpcSummaryDataService.tpsGraphData(queryObj);
    }

    if (TpSearchResponse.queryId === undefined || TpSearchResponse.queryId === null) {
      CalculatorRequest.travelDate = TpHelperService.getDateAsInteger(CalculatorRequest.travelDateStr);
      CalculatorRequest.oneWay = TpHelperService.getOnewayAsBoolean(CalculatorRequest.oneWay);
      CalculatorRequest.queryId = TpSearchResponse.prevQueryId;
      return TpCalculatorWrapperService.processData(CalculatorRequest)
        .then(getStatus)
        .then(getGraphData)
        .catch(performErrorHandling)
        .finally(freeResources);
  }
  else{
    var queryObj = TpHelperService.createQueryParamsFromOptions(TpSearchResponse.queryId, SummaryFilters.odcList, SummaryFilters.cabinOptions);
     return TpcSummaryDataService.tpsGraphData(queryObj);
  }
}

MarketsConfigPrepService.$inject = ['$state','TpcPleaseWaitService','TpcMessageService','TpGridService','TpcMarketsGraphDataService','MarketsFilters','TpSearchResponse'];
function MarketsConfigPrepService($state,TpcPleaseWaitService,TpcMessageService,TpGridService,TpcMarketsGraphDataService,MarketsFilters,TpSearchResponse) {
  TpGridService.setData(TpGridService.getMainGridData(), TpGridService.getDetailGridData());
  var mkts = TpGridService.getSelectedMarkets();
  MarketsFilters.populateOdc(mkts);
  var cabins = TpGridService.getSelectedCabinTypes();
  MarketsFilters.populateCabins(cabins);
  var queryObj = {};
  queryObj.queryId=TpSearchResponse.queryId;
  queryObj.isDownloadRequest = false;
  queryObj.marketFareClassList = TpGridService.getSelectedFareClasses();
  return TpcMarketsGraphDataService.marketsGraphsData(queryObj).then(function (result){
    return result;
  },function (response){
    performErrorHandling();
  });

  function performErrorHandling(){
    TpSearchResponse.queryId = null;
    TpcMessageService.addInternalErrorMessage();
    TpcPleaseWaitService.broadCastEventWithName('resolve-please-wait');
    $state.go('root.tpcalc.search');
  }
}

  GridConfigPrepService.$inject = ['$state','TpcPleaseWaitService','TpcMessageService','TpGridService','TpcGridDataService','SummaryFilters','TpHelperService','TpSearchResponse'];
  function GridConfigPrepService($state,TpcPleaseWaitService,TpcMessageService,TpGridService,TpcGridDataService,SummaryFilters,TpHelperService,TpSearchResponse) {
    function performErrorHandling(){
      TpSearchResponse.queryId = null;
      TpcMessageService.addInternalErrorMessage();
      TpcPleaseWaitService.broadCastEventWithName('resolve-please-wait');
      $state.go('root.tpcalc.search');
    }

    var queryObj = TpHelperService.createQueryParamsFromOptions(TpSearchResponse.queryId,SummaryFilters.odcList,SummaryFilters.cabinOptions);
    if(TpGridService.firstTime) {
      return TpcGridDataService.getFareClassesData(queryObj).then(function (result) {
        fcData = new Array();
        fcData.avialable = result;
        fcData.selected = [];

        var gridsLoaded = TpGridService.loadGridData(fcData, TpGridService.firstTime);
        TpGridService.firstTime = false;
        TpGridService.setData(TpGridService.getMainGridData(), TpGridService.getDetailGridData());
        return gridsLoaded;
      }, function (response) {
        performErrorHandling();
      })
    }
    else{
      fcData = new Array();
      fcData.avialable = TpGridService.getMainGridData();
      fcData.selected = TpGridService.getDetailGridData();

      var gridsLoaded = TpGridService.loadGridData(fcData,TpGridService.firstTime);
      return gridsLoaded;
    }

  }

  LookupDataPrepService.$inject = ['LookupDataService','auth'];
  function LookupDataPrepService(LookupDataService,auth) {
    var results=[];
    var lookupTypes = ['cities','carriers'];
    for(var i=0;i<lookupTypes.length;i++){
      LookupDataService.lookupData(lookupTypes[i]);
    }

  }

  TpSearchService.$inject = ['TpSearchResponse'];
  function TpSearchService(TpSearchResponse) {

      // Delete from mongo collection before resetting
      // future task to delete mongo collection, so reset for now
      TpSearchResponse.prevQueryId =  TpSearchResponse.queryId;
      TpSearchResponse.queryId = null;

  }

};


