'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('MarketsDashboardModel', MarketsDashboardModel);


  MarketsDashboardModel.$inject = ['$rootScope' ];


  function MarketsDashboardModel($rootScope) {

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
      getMarketsGraphWidget: getMarketsGraphWidget,
      reset: reset,
      removeWidget:removeWidget
    };

    function resizeChart (event, $element, widget) {
      if('graph'===widget.type){
        var doAnimation;
        var chart = widget.config.getHighcharts();
        var widgetHeight = $element[0].style.height.substring(0,$element[0].style.height.length-2) - 40;
        var widgetWidth = $element[0].style.width.substring(0,$element[0].style.width.length-2) - 40;
        if('daily_graph'===widget.id){
          widgetHeight = widgetHeight-90;
        }
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
          name: "Fare Class Amounts by Travel Date",
          id: 'markets_graph',
          partial: 'totalprice/calculator/views/marketgraphswidget.html',
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
        row: 1,
        sizeY: 1,
        sizeX: 2,
      });
    };

    function removeWidget(widget) {
      var numberOfWidgets=dashboardModel.widgets.length;
      var removedWidgetindex=dashboardModel.widgets.indexOf(widget);
      dashboardModel.widgets.splice(dashboardModel.widgets.indexOf(widget), 1);
    };

    function getMarketsGraphWidget() {
      angular.forEach(dashboardModel.widgets , function (value, key) {
        if('markets_graph'===value.id){
          return value;
        }
      });
    };

    $rootScope.$on('daily-graph-congifured', function(event, args) {
      var configs = args.configs;
      var dailygraphsWidget;
      angular.forEach(dashboardModel.widgets , function (value, key) {
        if('daily_graph'===value.id){
          dailygraphsWidget =  value;
        }
      });
      if(dailygraphsWidget === undefined){
        //push the widget
        dashboardModel.widgets.push( {
          col: 0,
          row: dashboardModel.widgets[0].sizeY+1,
          sizeY: 4,
          sizeX: 3,
          name: "Daily Price Breakdown",
          id: 'daily_graph',
          partial: 'totalprice/calculator/views/dailygraphwidget.html',
          allowDelete:true,
          type:'graph',
          initialized:false
        });

      }

    });

    return dashboardModel;

  }
})();
