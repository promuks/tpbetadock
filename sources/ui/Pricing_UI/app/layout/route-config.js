'use strict';

angular
  .module('app.layout')
  .config(config);


function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('root', {
      url: '/',
      abstract: true,
      views: {
        '@': {
          templateUrl: 'layout/layout.tpl.html'
        },
        'header@root': {
          templateUrl: 'layout/header.tpl.html',
          controller: 'HeaderController',
          controllerAs: 'hdr'
        },
        'footer@root': {
          templateUrl: 'layout/footer.tpl.html'
        },
        'navigation@root': {
          templateUrl: 'layout/navigation.tpl.html'
        }
      }
    })
    .state('unauthorized', {
      url: '/unauthorized',
      templateUrl: 'layout/errorPage.html'
    })
    .state('internalerror', {
      url: '/internalerror',
      templateUrl: 'layout/internalError.html'
    })
    .state('sessionexpired', {
      url: '/sessionexpired',
      templateUrl: 'layout/sessionexpired.html'
    })
};
