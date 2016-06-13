'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('MarketsGraphsController', MarketsGraphsController);

  MarketsGraphsController.$inject = ['TpcDownloadService','TpcMarketsGraphsService','MarketsConfigPrepService','MarketsFilters','MarketsDashboardModel','$timeout','$compile','$scope','TpcDailyGraphService'];

  function MarketsGraphsController(TpcDownloadService,TpcMarketsGraphsService,MarketsConfigPrepService,MarketsFilters,MarketsDashboardModel,$timeout,$compile,$scope,TpcDailyGraphService) {

    /*jshint validthis: true */
    var vmmg = this;

    vmmg.updateFCGraph = updateFCGraph;
    vmmg.marketsGraphFilters = MarketsFilters;
    vmmg.marketsDashboardModel = MarketsDashboardModel;
    vmmg.gridsterOptions = MarketsDashboardModel.gridsterOptions;
    vmmg.xLabelClick = xLabelClick;
    vmmg.doCompileGraphLink = doCompileGraphLink;
    vmmg.removeWidget = removeWidget;
    vmmg.getHeader = getHeader;
    vmmg.getDownloadOrder = getDownloadOrder;
    vmmg.getDownloadFileName = getDownloadFileName;

    activate();

    function activate() {
      vmmg.marketsDashboardModel.reset();
      vmmg.marketsGraphsConfig = MarketsConfigPrepService.graphConfig;
      doCompileGraphLink();
      vmmg.marketsGraphsConfig.options.chart.events.redraw = doCompileGraphLink;
      var marketgraphsWidget;
      angular.forEach(MarketsDashboardModel.widgets , function (value, key) {
        if('markets_graph'===value.id){
          marketgraphsWidget =  value;
        }
      });
      marketgraphsWidget.config=vmmg.marketsGraphsConfig;
    }

    vmmg.getDownloadArray = function() {
      return TpcMarketsGraphsService.getDownloadData();
    }

    function getHeader(){
      return TpcDownloadService.getDownloadHeader();
    }

    function getDownloadOrder(){
      return TpcDownloadService.getDownloadOrder();
    }

    function getDownloadFileName(){
      return TpcDownloadService.getDownloadFileName();
    }

    function doCompileGraphLink(){
      $timeout( function() {
        var element = $(".highcharts-container");
        $compile(element)($scope)
      },10);
    }

    function xLabelClick(a) {
      if(vmmg.dateClicked !== a){
        vmmg.dateClicked = a;
        TpcDailyGraphService.gotoDailyChartViewCompare(a);
      }
    };

    function removeWidget(widget) {
      vmmg.marketsDashboardModel.removeWidget(widget);
    };

    function updateFCGraph(){
      vmmg.marketsGraphsConfig.series = TpcMarketsGraphsService.generateFcsGraphSeriesData();
    };


    $scope.$on('gridster-resized', function(scope,sizes, gridster) {
      var isMarketsGraphWidget=false;
      var marketsGraphWidgetHeight=-1;
      var marketsGraphWidgetWeight=-1;
      // get a handle on the size of the element.
      for (var i = 0; i < gridster.grid.length; i++) {
        var grids = gridster.grid[i];
        //if(typeof grids != 'undefined'){
        if(typeof grids != 'undefined' && grids !== null){
          for (var j = 0; j < grids.length; j++) {
            var value = grids[j];
            if((typeof value !== 'undefined' && value !== null) && value.$element[0].innerHTML.indexOf('marketsgraphwidget')>=0){
              isMarketsGraphWidget=true;
              marketsGraphWidgetWeight= value.getElementSizeX();
              marketsGraphWidgetHeight= value.getElementSizeY();
              break;
            }
          }
        }
      }
      vmmg.marketsGraphsConfig.size = {
        width: marketsGraphWidgetWeight - 40,
        height: marketsGraphWidgetHeight - 40
      };


    })

  }

})();
