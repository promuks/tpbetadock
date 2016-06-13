'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('SummaryDashboardModel', SummaryDashboardModel);

  SummaryDashboardModel.$inject = ['$rootScope','$timeout','$log' ];

  function SummaryDashboardModel($rootScope,$timeout,$log) {

    var dashboardModel = {
      gridsterOptions:  {
        margins: [5, 5],
        columns: 3,
        rowHeight:150,
        swapping:true,
        minRows:2,
        draggable: {
          handle: 'h4', // optional selector for resize handle
          stop: function (event, $element, widget) {
            //TODO: remove after https://github.com/ManifestWebDesign/angular-gridster/issues/283 will be fixed
            var GridsterCtrl = $element.parent().parent().parent().find('*[gridster]').controller('gridster');
            var gridsterItems = $element.parent().parent().find('*[gridster-item]');
            gridsterItems.each(function (indes, node) {
              var ctrl = angular.element(node).controller('gridsterItem');
              GridsterCtrl.moveOverlappingItems(ctrl);
            });
          }
        },
         resizable: {
         enabled: true,
         handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
         stop: resizeChart // optional callback fired when item is finished resizing
         }
      },
      widgets: [],
      clear:clear,
      addWidget: addWidget,
      getSummaryGraphWidget: getSummaryGraphWidget,
      reset: reset,
      removeWidget:removeWidget,
      getOneDayGraphWidget:getOneDayGraphWidget
    };

    function resizeChart (event, $element, widget) {
      if('graph'===widget.type){
        var doAnimation;
        var chart = widget.config.getHighcharts();
        var widgetHeight = $element[0].style.height.substring(0,$element[0].style.height.length-2) - 40;
        var widgetWidth = $element[0].style.width.substring(0,$element[0].style.width.length-2) - 40;
        chart.setSize(widgetWidth, widgetHeight, doAnimation = true);
      }
    }

    function clear() {
      dashboardModel.widgets = [];
    };
    function initDashboard() {
      dashboardModel.widgets=[];
      dashboardModel.widgets.push(    {
          col: 0,
          row: 0,
          sizeY: 3,
          sizeX: 3,
          name: "",
          id: 'summary_graph',
          partial: 'totalprice/calculator/views/summarygraphwidget.html',
          allowDelete:false,
          type:'graph',
          initialized:false
        }
      );
    };
    function reset() {
      initDashboard();
    };

    function addWidget() {
      dashboardModel.widgets.push({
        name: "Daily Graph Widget",
        col: 0,
        row: 3,
        sizeY: 1,
        sizeX: 2,
      });
    };

    function getSummaryGraphWidget() {
      var summaryWidget;
      angular.forEach(dashboardModel.widgets , function (value, key) {
        if('summary_graph'===value.id){
          summaryWidget = value;
        }
      });
      return summaryWidget;
    };

    function getOneDayGraphWidget() {
      var onedayWidget;
      angular.forEach(dashboardModel.widgets , function (value, key) {
        if('oneday_graph'===value.id){
          onedayWidget = value;
        }
      });
      return onedayWidget;
    };

    function removeWidget(widget) {
      var numberOfWidgets=dashboardModel.widgets.length;
      var removedWidgetindex=dashboardModel.widgets.indexOf(widget);
      dashboardModel.widgets.splice(dashboardModel.widgets.indexOf(widget), 1);
    };

    $rootScope.$on('summary-grid-configured', function (event, args) {
      var configs = args.configs;
      var summaryGridWidget;
      angular.forEach(dashboardModel.widgets, function (value, key) {
        if ('summary_grid' === value.id) {
          summaryGridWidget = value;
        }
      });
      if (summaryGridWidget === undefined) {
        //push the widget
        dashboardModel.widgets.push({
          col: 0,
          row: 1,
          sizeY: 3,
          sizeX: 1,
          name: "Summary Grid",
          id: 'summary_grid',
          partial: 'totalprice/calculator/views/summarygridwidget.html',
          allowDelete:true,
          type:'grid'
        });
      }
    });
    $rootScope.$on('gridster-resizable-changed', function(gridster) {
      var chart = angular.element(
        document.getElementById('summarygraphchart')
      ).highcharts();
      $log.log(chart);
    })

    $rootScope.$on('gridster-draggable-changed', function(gridster) {
      var chart = angular.element(
        document.getElementById('summarygraphchart')
      ).highcharts();
      $log.log(chart);

      $timeout(function() {
        $rootScope.$broadcast('highchartsng.reflow');
      }, 10);
    })


    $rootScope.$on('oneday-graph-configured', function (event, args) {
      var configs = args.configs;
      var onedayGraphWidget;
      angular.forEach(dashboardModel.widgets, function (value, key) {
        if ('oneday_graph' === value.id) {
          onedayGraphWidget = value;
        }
      });
      if (onedayGraphWidget === undefined) {
        //push the widget
        dashboardModel.widgets.push({
          col: 0,
          row: dashboardModel.widgets[0].sizeY+1,
          sizeY: 6,
          sizeX: 3,
          name: "One Day Breakdown",
          id: 'oneday_graph',
          partial: 'totalprice/calculator/views/onedaygraphwidget.html',
          allowDelete:true,
          type:'graph'
        });
      }
    });
    initDashboard();
    return dashboardModel;
  }
})();
