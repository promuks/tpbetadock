(function () {
  angular.module('app.totalprice.calculator').factory('TpcOneDayGraphService',TpcOneDayGraphService);

  TpcOneDayGraphService.$inject = ['$state','TpcMessageService','TpHelperService','TpcOneDayGraphConfig','CalculatorRequest','TpcOneDayDataService','SummaryFilters','graphDefaults','$rootScope','TpSearchResponse'];

  function TpcOneDayGraphService($state,TpcMessageService,TpHelperService, TpcOneDayGraphConfig,CalculatorRequest,TpcOneDayDataService,SummaryFilters,graphDefaults,$rootScope,TpSearchResponse) {

      var gotoOneDayChartView = gotoOneDayChartView;

      var service = {
        gotoOneDayChartView: gotoOneDayChartView
      };
      return service;

      function performErrorHandling(){
        TpcMessageService.addInternalErrorMessage();
        $state.go('root.tpcalc.search');
      }

      function gotoOneDayChartView(dateSelected){
        TpcOneDayGraphConfig.oneDayChartConfig.series.splice(0);
        TpcOneDayGraphConfig.oneDayChartConfig.options.xAxis.categories.splice(0);
        var dayIndex = 1+ TpHelperService.getDaysForTS(TpHelperService.getTimeStamp(dateSelected),TpHelperService.getTimeStamp(CalculatorRequest.travelDateStr));
        var listOfCabin = TpHelperService.getListOfString(SummaryFilters.cabinList, 'id');
        var listOfMarkets = TpHelperService.getListOfString(SummaryFilters.odcList, 'id');
        var fieldName = SummaryFilters.amounts[0].value;
        var queryObj = {};
        queryObj.queryId=TpSearchResponse.queryId;
        queryObj.day=dayIndex;
        queryObj.cabinTypeList = listOfCabin;
        queryObj.marketList = listOfMarkets;
        if(TpcOneDayGraphConfig.oneDayChartConfig.graphData.length > 0){
          generateOneDaySeries(TpcOneDayGraphConfig.oneDayChartConfig.graphData);
        }else {
          var myDataPromise = TpcOneDayDataService.getOneDayData(queryObj);
          myDataPromise.then(function (jsonGraphData) {
            if(jsonGraphData !== undefined && jsonGraphData.constructor === Array) {
              TpcOneDayGraphConfig.oneDayChartConfig.graphData = jsonGraphData;
              generateOneDaySeries(jsonGraphData);
              $rootScope.$broadcast('oneday-graph-configured', {configs: {showOnedayGraph: true}});
            }else{
              performErrorHandling();
            }
          }, function (response) {
          performErrorHandling();
        });
        }
        function generateOneDaySeries(jsonGraphData) {
          var cats = [];
          var series = [];
          var aSerie = {};
          var data = [];
          var gMin = graphDefaults.gMin;
          var gMax = graphDefaults.gMax;
          var amt = 0;
            if (jsonGraphData.length > 0) {
              var market = jsonGraphData[0].market.toUpperCase();
              cats.push(market);
              aSerie.name = TpHelperService.formatMarket(market);
          }
          for (var i = 0; i < jsonGraphData.length; i++) {
            var currObj = jsonGraphData[i].adhocPricingResults;
            var market = jsonGraphData[i].market.toUpperCase();
            if (jQuery.inArray(market, listOfMarkets) !== -1 && jQuery.inArray(currObj.cabinType, listOfCabin) !== -1) {
              if (jQuery.inArray(jsonGraphData[i].market, cats) === -1) {
                cats.push(market);
                aSerie.data = data;
                series.push(aSerie);
                data = [];
                aSerie = {};
                aSerie.name = TpHelperService.formatMarket(market);
              }
              var item = {};
              item.fc = currObj.outboundFareClass;
              if (fieldName !== 'totalWOTaxAmt') {
                amt = TpHelperService.formatAmount(currObj[fieldName], currObj.decimals);
              } else {
                amt = TpHelperService.formatAmount(currObj['totalAmt'], currObj.decimals) - TpHelperService.formatAmount(currObj['taxAmt'], currObj.decimals);
              }
              if (gMin > amt) {
                gMin = amt
              }
              if (gMax < amt) {
                gMax = amt;
              }
              item.y = amt;
              item.x = cats.indexOf(market);
              data.push(item);
            }
          }
          if (data.length > 0) {
            aSerie.data = data;
            series.push(aSerie);
          }
          if (series.length === 0) {
            TpcOneDayGraphConfig.oneDayChartConfig.title.text = 'Selections Have Resulted at No Data to Graph';
          } else {
            TpcOneDayGraphConfig.oneDayChartConfig.title.text = isNaN(dateSelected) === true ?  dateSelected : TpHelperService.getFormatedDate(dateSelected);
          }
          TpcOneDayGraphConfig.oneDayChartConfig.options.yAxis.min = gMin - 10;
          TpcOneDayGraphConfig.oneDayChartConfig.options.yAxis.max = gMax + 10;
          TpcOneDayGraphConfig.oneDayChartConfig.series.push.apply(TpcOneDayGraphConfig.oneDayChartConfig.series, series);
          TpcOneDayGraphConfig.oneDayChartConfig.options.xAxis.categories.push.apply(TpcOneDayGraphConfig.oneDayChartConfig.options.xAxis.categories, cats);
          TpcOneDayGraphConfig.oneDayChartConfig.showOneDayGraph = true;
        }
      }

    }
})();
