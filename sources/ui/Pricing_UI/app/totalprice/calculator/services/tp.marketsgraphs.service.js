(function () {
  angular.module('app.totalprice.calculator').factory('TpcMarketsGraphsService', TpcMarketsGraphsService);

    TpcMarketsGraphsService.$inject = ['TpcDailyGraphConfig','TpHelperService', 'MarketsFilters', 'TpcMarketsGraphsConfig','graphDefaults','CalculatorRequest'];

    function TpcMarketsGraphsService (TpcDailyGraphConfig, TpHelperService, MarketsFilters, TpcMarketsGraphsConfig,graphDefaults,CalculatorRequest) {

      var gMin = graphDefaults.gMin;
      var gMax = graphDefaults.gMax;
      var startDate = graphDefaults.startDate;
      var endDate = graphDefaults.endDate;
      var graphData = {};
      var generateFcsGraphSeriesData = generateFcsGraphSeriesData;
      var getMarketsGraphConfig = getMarketsGraphConfig;
      var getDownloadData = getDownloadData;

      var service = {
        generateFcsGraphSeriesData:generateFcsGraphSeriesData,
        getMarketsGraphConfig:getMarketsGraphConfig,
        getDownloadData:getDownloadData
      };
      return service;

      function getMarketsGraphConfig(jsonData) {
        graphData =  jsonData;
        MarketsFilters.populateRoute(graphData);
        TpcDailyGraphConfig.dailysChartConfig.graphData = jsonData;
        TpcMarketsGraphsConfig.marketsGraphsConfig.series = generateFcsGraphSeriesData();
        return TpcMarketsGraphsConfig.marketsGraphsConfig;
      }

      function getDownloadData () {
        var listOfCabin = TpHelperService.getListOfString(MarketsFilters.cabinList, 'id');
        var listOfMarkets = TpHelperService.getListOfString(MarketsFilters.odcList, 'id');
        var listOfRoutes = TpHelperService.getListOfString(MarketsFilters.routeList, 'id');
        var downloadData = [];
        for (var i = 0; i < graphData.length; i++) {
          if (jQuery.inArray(graphData[i].market, listOfMarkets) !== -1 &&
            jQuery.inArray(graphData[i].adhocPricingResults[0].cabinType, listOfCabin) !== -1) {
            var iteamArray = graphData[i].adhocPricingResults;
            for (var j = 0; j < iteamArray.length; j++) {
              var innerObj = iteamArray[j];
              if (jQuery.inArray(innerObj.outRoute, listOfRoutes) === -1) {
                continue;
              }
              downloadData.push(innerObj);
            }
          }
        }
        return downloadData;
      }

      function generateFcsGraphSeriesData () {
        var series = [];
        TpcDailyGraphConfig.dailysChartConfig.showDailyGraph = false;
        var listOfCabin = TpHelperService.getListOfString(MarketsFilters.cabinList,'id');
        var listOfMarkets = TpHelperService.getListOfString(MarketsFilters.odcList,'id');
        var fieldName = MarketsFilters.amounts[0].value;
        startDate = TpHelperService.getTimeStamp(CalculatorRequest.travelDateStr);
        endDate = startDate + graphDefaults.endDate;

        gMin = 10000000000;
        gMax = 0;
        // generate series and split points
        for (var i = 0; i < graphData.length; i++) {
          if(jQuery.inArray(graphData[i].market, listOfMarkets) !== -1 &&
            jQuery.inArray(graphData[i].adhocPricingResults[0].cabinType, listOfCabin) !== -1) {
            var oneGraph = getOneGraphData(graphData[i].adhocPricingResults, graphData[i].adhocPricingResults[0].decimals, fieldName);
            var comboName = graphData[i].marketFareClassCombo.split('-');
            if (oneGraph.data.length > 0) {
              var oneSeries = {
                name: TpHelperService.formatMarket(comboName[0]) + ' '+comboName[1],
                route: oneGraph.routes,
                color: Highcharts.getOptions().colors[i],
                data: oneGraph.data
              };
              series.push(oneSeries);
            }
          }

        }
        TpcMarketsGraphsConfig.marketsGraphsConfig.options.xAxis.min = startDate;
        TpcMarketsGraphsConfig.marketsGraphsConfig.options.xAxis.max = endDate;
        TpcMarketsGraphsConfig.marketsGraphsConfig.options.yAxis.min = gMin - 10;
        TpcMarketsGraphsConfig.marketsGraphsConfig.options.yAxis.max = gMax + 10;
        if(series.length < 1 ) {
          TpcMarketsGraphsConfig.marketsGraphsConfig.title.text = 'Selections Have Resulted at No Data to Graph';
        }else{
          TpcMarketsGraphsConfig.marketsGraphsConfig.title.text = '';
        }
        return series;
      }

      function getOneGraphData(iteamArray, decimals, fieldName ) {
        var amt;
        var chartData = [];
        var routes = new Object();
        var oneGraph = {};
        var day = 1;
        var prevDay;
        var empty = {
          y: null
        };
        var marker =
        {
          enabled: true,
          symbol: 'circle',
          radius: 1.5
        };
        var emptyAdded = false;
        var listOfRoutes = TpHelperService.getListOfString(MarketsFilters.routeList,'id');
        for (var j = 0; j < iteamArray.length; j++) {
          var innerObj = iteamArray[j];
          if(jQuery.inArray(innerObj.outRoute,listOfRoutes) === -1){
            continue;
          }
          var days = innerObj.day;
          var diffDays = days - day;
          if (diffDays > 1) {
            if (emptyAdded === true || chartData.length === 1) {
              var prev = chartData.pop();
              prev.marker = marker;
              chartData.push(prev);
            }
            if(chartData.length > 0) {
              empty.x = TpHelperService.getTSForOutDate(prevDay + '') + 24 * 3600 * 1000 * 180;
              chartData.push(empty);
              emptyAdded = true;
            }
          } else {
            emptyAdded = false;
          }
          day = days;
          if (fieldName !== 'totalWOTaxAmt') {
            amt = TpHelperService.formatAmount(innerObj[fieldName], decimals);
          }else
          {
            amt = TpHelperService.formatAmount(innerObj['totalAmt'], decimals) - TpHelperService.formatAmount(innerObj['taxAmt'], decimals);
          }
          if (gMin > amt) {
            gMin = amt
          }
          if (gMax < amt) {
            gMax = amt;
          }
          var obj = {};
          obj.y = amt;
          obj.x = TpHelperService.getTSForOutDate(innerObj.outDate);
          obj.dat = TpHelperService.getFormatedDate(obj.x);
          routes[obj.x]=TpHelperService.chunkString(innerObj.outRoute,3).join('-');
          chartData.push(obj);
          prevDay = innerObj.outDate;
        }

        if (emptyAdded === true) {
          var prev = chartData.pop();
          var obj = {};
          obj.y = prev.y;
          obj.marker = marker;
          chartData.push(obj);
        }
        oneGraph.data = chartData;
        oneGraph.routes = routes;
        return oneGraph;
      }
    }

    //function getOneFCSeriesData(gridData) {
    //  if(true ||(jQuery.inArray(gridData.market, listOfMarkets) !== -1 &&
    //    jQuery.inArray(gridData.adhocPricingResults[0].cabinType, listOfCabin) !== -1)) {
    //    var oneSeries = {
    //      name: gridData.marketFareClassCombo,
    //      market: gridData.market,
    //      pointStart: startDate,
    //      pointInterval: 1 * 3600 * 1000 * 24,
    //      data: getOneGraphData(gridData.adhocPricingResults, gridData.adhocPricingResults[0].decimals, fieldName)
    //    };
    //  }
    //
    //  TpcMarketsGraphsConfig.marketsGraphsConfig.options.yAxis.min = gMin - 10;
    //  TpcMarketsGraphsConfig.marketsGraphsConfig.options.yAxis.max = gMax + 10;
    //  return oneSeries;
    //}
    //function buildStreamFCGrpah (){
    //  jsonData.splice(0);
    //  TpcDailyGraphService.jsonGraphData.splice(0);
    //  TpcDailyGraphConfig.dailysChartConfig.showDailyGraph = false;
    //  listOfCabin = TpHelperService.getListOfString(MarketsFilters.cabinList,'id');
    //  listOfMarkets = TpHelperService.getListOfString(MarketsFilters.odcList,'id');
    //  fieldName = MarketsFilters.amounts[0].value;
    //  var effDate = TpHelperService.getTimeStamp(CalculatorRequest.travelDate);
    //  startDate = effDate;
    //  endDate = startDate + graphDefaults.endDate;
    //  TpcMarketsGraphsConfig.marketsGraphsConfig.options.xAxis.min = startDate;
    //  TpcMarketsGraphsConfig.marketsGraphsConfig.options.xAxis.max = endDate;
    //  return initGraph();
    //}
    //
    //
    //function initGraph() {
    //  var myintvl = setInterval(function () {
    //
    //    if (myflag-- < 0) {
    //      clearInterval(myintvl);
    //    }else{
    //      var promise = TpcMarketsGraphDataService.marketsGraphsData();
    //      promise.then(function (response) {
    //        var i = Math.floor((Math.random() * response.data.length));
    //        var gridData = response.data[i];
    //        jsonData.push(gridData);
    //        TpcDailyGraphService.jsonGraphData.push(gridData);
    //        TpcMarketsGraphsConfig.marketsGraphsConfig.series.push(getOneFCSeriesData(gridData));
    //      },  function (response) {
    //        return 'Oops! There was a problem. Please contact ATPCO Support.';
    //      });
    //    }
    //  }, 2000);
    //}
})();


