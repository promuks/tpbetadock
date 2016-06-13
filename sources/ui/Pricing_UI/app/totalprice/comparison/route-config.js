'use strict';

angular
  .module('app.totalprice.calculator')
  .config(config);


function config($stateProvider, $urlRouterProvider) {

  $stateProvider
    // START: TPC SEARCH View //
    .state('root.tpcomp', {
      url: 'tpcomp',
      templateUrl: 'totalprice/comparison/comparison.html'
    })
  // END: TPC SEARCH View //

};
