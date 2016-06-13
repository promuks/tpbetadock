'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('OneDayGraphController', OneDayGraphController);

  OneDayGraphController.$inject = ['TpcOneDayGraphConfig','SummaryDashboardModel','$scope'];

  function OneDayGraphController(TpcOneDayGraphConfig,SummaryDashboardModel,$scope) {

    /*jshint validthis: true */
    var vmod = this;

    activate();

    function activate() {
      vmod.oneDayChartConfig = TpcOneDayGraphConfig.oneDayChartConfig;
      var onedaygraphWidget = SummaryDashboardModel.getOneDayGraphWidget();
      onedaygraphWidget.config=vmod.oneDayChartConfig;
    }

    $scope.$on('gridster-resized', function(sizes,sizeheight, gridster) {

      var isOnedayGraphWidget=false;
      var onedayGraphWidgetHeight=-1;
      var onedayGraphWidgetWeight=-1;
      // get a handle on the size of the element.
      for (var i = 0; i < gridster.grid.length; i++) {
        var grids = gridster.grid[i];
        //if(typeof grids != 'undefined'){
        if(typeof grids != 'undefined' && grids !== null){
          for (var j = 0; j < grids.length; j++) {
            var value = grids[j];
            if( (typeof value !== 'undefined' && value !== null) && value.$element[0].innerHTML.indexOf('onedaygraphwidget')>=0){
              isOnedayGraphWidget=true;
              onedayGraphWidgetWeight= value.getElementSizeX();
              onedayGraphWidgetHeight= value.getElementSizeY();
              break;
            }
          }
        }
      }
      vmod.oneDayChartConfig.size = {
        width: onedayGraphWidgetWeight - 40,
        height: onedayGraphWidgetHeight - 40
      };


    })

  }

})();
