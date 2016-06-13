'use strict';

angular
  .module('app.dashboard')
  .config(config);


function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    // START: DASHBOARD View //
    .state('root.dashboard', {
      url: 'dashboard',
      parent: 'root',
      templateUrl: 'dashboard/dashboard.html'
    })
    // END: DASHBOARD View //
};
