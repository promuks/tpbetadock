'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular.module('app', [

  // Angular modules
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'ui.bootstrap',
/*  'ngMockE2E',*/
  // 3rd party modules

  'ui.router',
  'xtForm',
  'highcharts-ng',
  'gridster',
  'isteven-multi-select',
  'MassAutoComplete',
  'ui.bootstrap',
  'cgBusy',
  // custom modules
  /*
  Feature/Demo areas
   */
  'config',
  'app.home',
  'app.layout',

  'app.dashboard',

  'app.marketview',
  'app.totalprice',
  'app.websocketsDemo',
  'app.common',
  'ngCsv',
  'angular-google-analytics',
  'ngIdle'
])
  .config(function (AnalyticsProvider) {
    // Add configuration code as desired - see below
    AnalyticsProvider.setAccount({
      tracker: 'UA-23003153-1',
      /*name: 'Total Price',*/
      displayFeatures: true,
      enhancedLinkAttribution: true,
      trackEvent: true
    });
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
  })
  .config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(1800);
    KeepaliveProvider.interval(3600);
  }])
  .run(function($rootScope, TpAuthService,TpSessionService, $location, $state,$cookies) {
    $cookies.put('TP_AUTH',Math.floor(Math.random() * 1000000000000000));
    // This events gets triggered on an error or promise reject on a URL change
    $rootScope.$on('$stateChangeError', function(event, toState  , toParams
      , fromState, fromParams) {
      if(!$rootScope.authorized){
        $rootScope.authorized=true;
        event.preventDefault();
        if($rootScope.isAuthorized===false){
          $state.go('unauthorized');
          return;
        }if($rootScope.isSessionexpired===true){
          $state.go('sessionexpired');
          return;
        } else{
          $state.go('internalerror');
          return;
        }
      }
    });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams,fromState) {
      if(toState.name==='sessionexpired'){
        return;
      }
      var sessionExpired = TpSessionService.isSessionExpired();
      if (sessionExpired) {
        event.preventDefault();
        $state.go('sessionexpired');
      }
      if (toState.name === 'root.tpcalc.search' &&
        (fromState.name === 'root.tpcalc.gridresult' || fromState.name === 'root.tpcalc.FCSelectFromMarketGraphs')) {
        event.preventDefault();
      }
    });
  })
  .run(['Idle', function(Idle) {
    Idle.watch();
  }])
  .run(function($rootScope, $window) {
    $rootScope.$on('IdleTimeout', function() {
      $window.close();
    });
  });

