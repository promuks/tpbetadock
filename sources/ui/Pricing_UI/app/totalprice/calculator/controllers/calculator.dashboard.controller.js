'use strict';

angular.module('app.totalprice.calculator').controller('CustomWidgetCtrl', ['$scope', '$modal','MarketsDashboardModel','$log',
    function($scope, $modal, MarketsDashboardModel,$log) {

      $scope.remove = function(widget) {
        $log.log('inside custom widget');
        var numberOfWidgets=MarketsDashboardModel.widgets.length;
        var removedWidgetindex=MarketsDashboardModel.widgets.indexOf(widget);
        $log.log('in here number:'+numberOfWidgets+':index:'+removedWidgetindex);
        MarketsDashboardModel.widgets.splice(MarketsDashboardModel.widgets.indexOf(widget), 1);
/*        MarketsDashboardModel.widgets[0].row=0;
        MarketsDashboardModel.widgets[0].col=0;
        MarketsDashboardModel.widgets[0].sizeY=4;
        MarketsDashboardModel.widgets[0].sizeX=5;

        var chart = MarketsDashboardModel.widgets[0].config.getHighcharts();
        var widgetHeight = MarketsDashboardModel.gridsterOptions.rowHeight * 4 - 60;
        var widgetWidth = MarketsDashboardModel.gridsterOptions.rowHeight * 5 - 90;
        var doAnimation;
        chart.setSize(widgetWidth, widgetHeight, doAnimation = true);

        MarketsDashboardModel.widgets[0].config.options.func(chart);*/
        $scope.$apply;
      };

      $scope.openSettings = function(widget) {
        $modal.open({
          scope: $scope,
          templateUrl: 'totalprice/calculator/views/widget_settings.html',
          controller: 'WidgetSettingsCtrl',
          resolve: {
            widget: function() {
              return widget;
            }
          }
        });
      };

    }
  ])

  .controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
    function($scope, $timeout, $rootScope, $modalInstance, widget) {
      $scope.widget = widget;

      $scope.form = {
        name: widget.name,
        sizeX: widget.sizeX,
        sizeY: widget.sizeY,
        col: widget.col,
        row: widget.row
      };

      $scope.sizeOptions = [{
        id: '1',
        name: '1'
      }, {
        id: '2',
        name: '2'
      }, {
        id: '3',
        name: '3'
      }, {
        id: '4',
        name: '4'
      }];

      $scope.dismiss = function() {
        $modalInstance.dismiss();
      };

      $scope.remove = function() {
        $log.log('inside non custom widget');
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        $modalInstance.close();
      };

      $scope.submit = function() {
        angular.extend(widget, $scope.form);

        $modalInstance.close(widget);
      };

    }
  ])

// helper code
  .filter('object2Array', function() {
    return function(input) {
      var out = [];
      for (i in input) {
        out.push(input[i]);
      }
      return out;
    }
  });
