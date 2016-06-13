'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('CalculatorController', CalculatorController);

  CalculatorController.$inject = ['CalculatorRequest','$window'];

  function CalculatorController(CalculatorRequest,$window) {

    /*jshint validthis: true */
    var vm = this;
    var height = angular.element($window).height() - 50;
    angular.element('#main').css('height', height+'px');
  }
})();
