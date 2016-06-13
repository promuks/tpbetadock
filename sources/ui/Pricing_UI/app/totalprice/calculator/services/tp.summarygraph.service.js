(function () {
  angular.module('app.totalprice.calculator').factory('TpcSummaryGraphService',TpcSummaryGraphService);

  TpcSummaryGraphService.$inject = ['TpHelperService', 'graphDefaults','TpcSummaryGraphConfig','CalculatorRequest','SummaryFilters','TpcOneDayGraphService','TpcOneDayGraphConfig'];

  function TpcSummaryGraphService (TpHelperService, graphDefaults,TpcSummaryGraphConfig, CalculatorRequest, SummaryFilters,TpcOneDayGraphService,TpcOneDayGraphConfig) {

      var getSummaryGraphConfig = getSummaryGraphConfig;
      var generateGraphSeriesData = generateGraphSeriesData;
      var gMax = graphDefaults.gMax;
      var gMin = graphDefaults.gMin;
      var startDate = graphDefaults.startDate;
      var endDate = graphDefaults.endDate;

      var service = {
        generateGraphSeriesData: generateGraphSeriesData,
        getSummaryGraphConfig: getSummaryGraphConfig
      };
      return service;

      function getSummaryGraphConfig(jsonData) {
        SummaryFilters.populateOdc(jsonData);
        TpcSummaryGraphConfig.summaryChartConfig.series = generateGraphSeriesData(jsonData);
        return TpcSummaryGraphConfig.summaryChartConfig;
      }

      function generateGraphSeriesData(gridData) {
        var listOfCabin = TpHelperService.getListOfString(SummaryFilters.cabinList, 'id');
        var listOfMarkets = TpHelperService.getListOfString(SummaryFilters.odcList, 'id');
        var listOfOps = TpHelperService.getListOfString(SummaryFilters.opList, 'id');
        var fieldName = SummaryFilters.amounts[0].value;
        var xdata = [];
        var ydata = [];
        var zdata = [];
        gMax = graphDefaults.gMax;
        gMin = graphDefaults.gMin;
        startDate = TpHelperService.getTimeStamp(CalculatorRequest.travelDateStr);
        endDate = startDate + graphDefaults.endDate;
        for (var i = 0; i < gridData.length; i++) {
          if (jQuery.inArray(gridData[i].market, listOfMarkets) !== -1 && jQuery.inArray(gridData[i].cabinType, listOfCabin) !== -1) {
            xdata.push(TpHelperService.formatMarket(gridData[i].market)+ " " + gridData[i].cabinType.replace(/([a-z])([A-Z])/g, '$1 $2'));
            for (var j = 0; j < listOfOps.length; j++) {
              ydata.push(getOneGraphData(gridData[i].amountDetails, gridData[i].decimals, listOfOps[j], fieldName));
            }
            zdata.push(TpHelperService.formatMarket(gridData[i].market) + "," + gridData[i].currencyCd + "," + gridData[i].cabinType);
          }
        }
        if (TpcOneDayGraphConfig.oneDayChartConfig.showOneDayGraph === true){
          TpcOneDayGraphService.gotoOneDayChartView(CalculatorRequest.travelDateStr);
        }
        return generateSeries(xdata, ydata, zdata, listOfOps);
      }

      function generateSeries(names, points, markets, listOfOps) {
        var series = [], len = names.length;

        // generate series and split points
        for (var i = 0; i < len; i++) {
          for (var j = 0; j < listOfOps.length; j++) {
            var lineWidth = 2.5;
            if (listOfOps[j] === 'Highest') {
              lineWidth = 3.5;
            } else if (listOfOps[j] === 'Lowest') {
              lineWidth = 1.5;
            }
            var oneSeries = {
              name: names[i],
              market: markets[i],
              lineWidth:lineWidth,
              color: Highcharts.getOptions().colors[i],
              pointStart: startDate,
              pointInterval: 1 * 3600 * 1000 * 24,
              data: points[i + j]
            };
            if (lineWidth !== 2.5) {
              oneSeries.linkedTo = ':previous';
            }
            series.push(oneSeries);
          }
        }
        TpcSummaryGraphConfig.summaryChartConfig.options.xAxis.min = startDate;
        TpcSummaryGraphConfig.summaryChartConfig.options.xAxis.max = endDate;
        TpcSummaryGraphConfig.summaryChartConfig.options.yAxis.min = gMin - 10;
        TpcSummaryGraphConfig.summaryChartConfig.options.yAxis.max = gMax + 10;
        if(series.length < 1 ) {
          TpcSummaryGraphConfig.summaryChartConfig.title.text = 'Selections Have Resulted at No Data to Graph';
          TpcSummaryGraphConfig.summaryChartConfig.func = function (chart) {};
        }else{
          TpcSummaryGraphConfig.summaryChartConfig.title.text = '';
          TpcSummaryGraphConfig.summaryChartConfig.func = function (chart) {
            var fromDate = TpHelperService.getTimeStamp(CalculatorRequest.travelDateStr);
            var toDate = fromDate + 86400000 * 30;

            chart.xAxis[0].setExtremes(fromDate, toDate);
            chart.showResetZoom();
          };
        }
        return series;
      }

      function getOneGraphData(iteamArray, decimals, operation, fieldName ) {
        var amt;
        var chartData = [];
        var day = 1;
        var empty = {
          y: null
        };
        var marker =
        {
          enabled: true,
          symbol: 'circle',
          radius: 1.5
        };
        var firstDay = false;
        var emptyAdded = false;
        for (var j = 0; j < iteamArray.length; j++) {
          var innerObj = iteamArray[j];
          var days = innerObj.day;
          var diffDays = days - day;
          firstDay = false;
          if (diffDays > 1) {
            if (emptyAdded === true || firstDay === true) {
              var prev = chartData.pop();
              var obj = {};
              obj.y = prev.y;
              obj.marker = marker;
              chartData.push(obj);
            }
            emptyAdded = true;
            for (var k = 1; k < diffDays; k++) {
              chartData.push(empty);
            }
          } else {
            if (diffDays === 0) {
              firstDay = true;
            }
            emptyAdded = false;
          }
          day = days;
          amt = TpHelperService.formatAmount(innerObj[operation][fieldName], decimals);
          if (gMin > amt) {
            gMin = amt
          }
          if (gMax < amt) {
            gMax = amt;
          }
          var obj = {};
          obj.y = amt;
          chartData.push(obj);
        }

        if (emptyAdded === true) {
          var prev = chartData.pop();
          var obj = {};
          obj.y = prev.y;
          obj.marker = marker;
          chartData.push(obj);
        }
        return chartData;
      }
    }
})();


