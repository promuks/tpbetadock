'use strict';

angular
  .module('app.websocketsDemo')
  .config(config);


function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    // START: SEARCH View //
    .state('root.websockets', {
      url: 'websockets',
      parent: 'root',
      templateUrl: 'websockets/message.html',
      controller: 'MessageCtrl'
    })
    // END: SEARCH View //
};
