'use strict';
(function () {

  angular.module('app.layout').controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope','$rootScope'];

  function HeaderController($scope,$rootScope) {

    /*jshint validthis: true */
    var hdr = this;
    hdr.userId=$rootScope.userId;
    hdr.dateTime = new Date();
  }
})();
