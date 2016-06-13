'use strict';
(function () {

  angular.module('app.totalprice.calculator').controller('CalculatorGraphController', CalculatorGraphController);

  CalculatorGraphController.$inject = ['TpcDownloadService','SummaryFilters', 'SummaryConfigPrepService','TpcSummaryGraphService','TpcOneDayGraphService','TpcOneDayGraphConfig','$timeout','$compile','$scope','SummaryDashboardModel','Analytics'];

  function CalculatorGraphController(TpcDownloadService,SummaryFilters,SummaryConfigPrepService, TpcSummaryGraphService,TpcOneDayGraphService,TpcOneDayGraphConfig,$timeout,$compile,$scope,SummaryDashboardModel,Analytics) {

    /*jshint validthis: true */
    var vmg = this;

    vmg.updateGraph = updateGraph;
    vmg.logFiltersSelection=logFiltersSelection;
    vmg.tpcGraphFilters = SummaryFilters;
    vmg.xLabelClick = xLabelClick;
    vmg.doCompileGraphLink = doCompileGraphLink;
    vmg.summaryDashboardModel = SummaryDashboardModel;
    vmg.removeWidget = removeWidget;
    vmg.gridsterOptions = SummaryDashboardModel.gridsterOptions;
    vmg.dateClicked= '';
    vmg.getHeader = getHeader;
    vmg.getDownloadOrder = getDownloadOrder;
    vmg.getDownloadFileName = getDownloadFileName;
    vmg.summaryChartWidth = angular.element(document.getElementById('summarygraphchart')).width();


    activate();

    function activate() {
      SummaryDashboardModel.reset();
      doCompileGraphLink();
      vmg.summaryChartConfig = SummaryConfigPrepService.graphConfig;
      vmg.summaryChartConfig.options.chart.events.redraw = doCompileGraphLink;
      vmg.summaryChartData = SummaryConfigPrepService.graphData;
      TpcOneDayGraphConfig.oneDayChartConfig.showOneDayGraph = false;

      var summarygraphWidget = SummaryDashboardModel.getSummaryGraphWidget();
      summarygraphWidget.config=vmg.summaryChartConfig;
      SummaryDashboardModel.getSummaryGraphWidget().name = 'Summary of '+ vmg.tpcGraphFilters.amounts[0].name + ' by Travel Date';
    }

    function updateGraph(){
      Analytics.trackEvent('Results Page', 'Clicked', 'Search');
      SummaryDashboardModel.getSummaryGraphWidget().name = 'Summary of '+ vmg.tpcGraphFilters.amounts[0].name + ' by Travel Date';
      vmg.summaryChartConfig.showFCGrid = false;
      vmg.summaryChartConfig.series = TpcSummaryGraphService.generateGraphSeriesData(vmg.summaryChartData);
    };

    vmg.getDownloadArray = function() {
      return TpcDownloadService.getDownloadData([[]]);
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

    function removeWidget(widget) {
      vmg.summaryDashboardModel.removeWidget(widget);
    };

    function logFiltersSelection(form) {
      if(ENV.debug){
        // for logger..
      }
    };

    function xLabelClick(a) {
      if(vmg.dateClicked !== a){
        vmg.dateClicked = a;
        TpcOneDayGraphConfig.oneDayChartConfig.graphData.splice(0);
        TpcOneDayGraphService.gotoOneDayChartView(a);
      }
    };

    function doCompileGraphLink(){
      $timeout( function() {
        var element = angular.element('.highcharts-axis-labels text, .highcharts-axis-labels span');
        $compile(element)($scope)
      },10);
    }

    $scope.$on('gridster-resized', function(scope,sizes, gridster) {
      var isSummaryGraphWidget=false;
      var summaryGraphWidgetHeight=-1;
      var summaryGraphWidgetWeight=-1;
      // get a handle on the size of the element.
      for (var i = 0; i < gridster.grid.length; i++) {
        var grids = gridster.grid[i];
        if(typeof grids != 'undefined' && grids !== null){
          for (var j = 0; j < grids.length; j++) {
            var value = grids[j];
            if((typeof value !== 'undefined' && value !== null) && value.$element[0].innerHTML.indexOf('summarygraphwidget')>=0){
              isSummaryGraphWidget=true;
              summaryGraphWidgetWeight= value.getElementSizeX();
              summaryGraphWidgetHeight= value.getElementSizeY();
              break;
            }
          }
        }
      }
      vmg.summaryChartConfig.size = {
        width: summaryGraphWidgetWeight - 40,
        height: summaryGraphWidgetHeight - 40
      };


    })

  }

})();

