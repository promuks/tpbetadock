'use strict';

angular
  .module('app.marketview')
  .config(config);


function config($stateProvider, $urlRouterProvider) {

	$stateProvider
    // START: SEARCH View //
    .state('root.nmv', {
      url: 'nmv',
      templateUrl: 'marketview/views/search.html',
      controller: 'MarketviewSearchController',
      controllerAs: 'vms'
    })
    // END: SEARCH View //


      // START: MARKETVIEW SEARCH View //
    .state('root.nmv.search', {
      url: '/search',
      templateUrl: 'marketview/views/search.html',
      controller: 'MarketviewSearchController',
      controllerAs: 'vm'
    })
  // END: TPC SEARCH View //


    // START: TPC RESULT View //
    .state('root.nmv.extsearch', {
      url: '/extsearch',
      templateUrl: 'marketview/views/extendedsearch.html',
      controller: 'MarketviewExtendedSearchController',
      controllerAs: 'vme',
    })
    // END: TPC RESULT View //

    // START: Grid Results //
    .state('root.nmv.gridresult', {
      url: '/nmvgridresult',
      templateUrl: 'marketview/views/nmvgridresult.html',
      controller: 'MarketViewGridController',
      controllerAs: 'vms',
      resolve: {
        GridConfigPrepService: GridConfigPrepService
      }
    })
  // END: Grid RESULT View //

};

GridConfigPrepService.$inject = ['NmvGridDataService','NmvGridService'];
function GridConfigPrepService(NmvGridDataService,NmvGridService) {
  var myDataPromise = NmvGridDataService.getSearchData;
  myDataPromise.then(function(result) {
    return NmvGridService.loadGridData(result);
  });

}
