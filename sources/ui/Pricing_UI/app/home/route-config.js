'use strict';

angular
  .module('app.home')
  .config(config);


function config($stateProvider, $urlRouterProvider) {

/*  $urlRouterProvider
    .when('/', '/home')
    .otherwise("/home");*/

  $stateProvider
    // START: HOME STATES AND NESTED VIEWS //
    .state('root.home', {
      url: 'home',
      parent: 'root',
      templateUrl: 'home/home.tpl.html'
    })
    .state('root.home.nmv', {
      url: '/nmv',
      templateUrl: 'home/partial-nmv-desc.html',
      controller: function ($scope) {
        $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
      }
    })

    .state('root.home.tpc', {
      url: '/tpc',
      templateUrl: 'home/partial-tpc-desc.html'
    })
    // END: HOME STATES AND NESTED VIEWS //


};
