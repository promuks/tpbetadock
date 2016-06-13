'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('DailyGraphController', DailyGraphController);

  DailyGraphController.$inject = ['TpcDailyGraphConfig','$scope','MarketsDashboardModel','stacked','TpcDailyGraphService','$log'];

  function DailyGraphController(TpcDailyGraphConfig, $scope,MarketsDashboardModel,stacked,TpcDailyGraphService,$log) {

    /*jshint validthis: true */
    var vmdg = this;
    vmdg.marketsDashboardModel = MarketsDashboardModel;
    vmdg.updateGraph = updateGraph;
    activate();

    function activate() {
      vmdg.stacked=stacked;
      vmdg.graphOp= stacked[0];
      vmdg.dailyChartConfig = TpcDailyGraphConfig.dailysChartConfig;
      var dailygraphsWidget;
      angular.forEach(MarketsDashboardModel.widgets , function (value, key) {
        if('daily_graph'===value.id){
          dailygraphsWidget =  value;
        }
      });
      dailygraphsWidget.config=vmdg.dailyChartConfig;
    }


    function updateGraph(el) {
      TpcDailyGraphService.updateGraphView();

      var gridWidth = el.$parent.$parent.gridsterItem.getElementSizeX() - 40;
      var gridHeight = el.$parent.$parent.gridsterItem.getElementSizeY() - 130;

      vmdg.dailyChartConfig.size = {width: gridWidth, height: gridHeight};

    };


    $scope.$on('gridster-resized', function(scope,sizes, gridster) {
      $log.log('inside daily resize');
      var isDailyGraphWidget=false;
      var dailyGraphWidgetHeight=-1;
      var dailyGraphWidgetWeight=-1;
      // get a handle on the size of the element.
      for (var i = 0; i < gridster.grid.length; i++) {
        var grids = gridster.grid[i];
        /*if(typeof grids != 'undefined'){*/
        if(typeof grids != 'undefined' && grids !== null){
          for (var j = 0; j < grids.length; j++) {
            var value = grids[j];
            if(/*typeof value != 'undefined' */ (typeof value !== 'undefined' && value !== null) && value.$element[0].innerHTML.indexOf('dailygraphwidget')>=0){
              isDailyGraphWidget=true;
              dailyGraphWidgetWeight= value.getElementSizeX() - 40;
              dailyGraphWidgetHeight= value.getElementSizeY()- 130;
              break;
            }
          }
        }
      }
      vmdg.dailyChartConfig.size = {
        width: dailyGraphWidgetWeight,
        height: dailyGraphWidgetHeight
      };
      $log.log('changed widget size to'+vmdg.dailyChartConfig.size.width+':'+vmdg.dailyChartConfig.size.height);

    })

  }

})();
