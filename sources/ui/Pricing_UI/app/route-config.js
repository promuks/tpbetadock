'use strict';

angular
  .module('app')
  .config(config);


function config($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    .when('/', '/tpcalc/search')
    .otherwise("/tpcalc/search");

};
