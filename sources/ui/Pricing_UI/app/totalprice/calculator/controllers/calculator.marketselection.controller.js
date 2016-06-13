'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('CalculatorGridController', CalculatorGridController);
  CalculatorGridController.$inject = ['TpGridService','$scope'];

  function CalculatorGridController(TpGridService,$scope) {
    /*jshint validthis: true */
    var vmgr = this;
    vmgr.loaded = TpGridService.loaded;




    //var myapplyfunc = function(){
    //  //$scope.$apply();
    //  vmgr.loaded = TpGridService.loaded;
    //}
    //TpGridService.newMyApply(myapplyfunc);

      //myapplyfunc
    //$scope.$watch('TpGridService.loaded', function (newVal, oldVal) {
    //  if (newVal) {
    //    vmgr.loaded = newVal;
    //  }
    //});


/*    $scope.$watch(function () {
        return TpGridService.loaded;
      },
      function (newValue, oldValue) {
        if (newValue == oldValue)
          return;
        vmgr.loaded = newValue;
        alert("isLoggedIn changed from " + oldValue + " to " + newValue);
      }, true);*/


  }



})();

