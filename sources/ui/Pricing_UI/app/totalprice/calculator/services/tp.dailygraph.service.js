(function () {
  angular.module('app.totalprice.calculator').factory('TpcDailyGraphService',TpcDailyGraphService);

  TpcDailyGraphService.$inject = ['TpHelperService','TpcDailyGraphConfig','CalculatorRequest','stacked', '$rootScope'];

  function TpcDailyGraphService(TpHelperService, TpcDailyGraphConfig,CalculatorRequest, stacked,$rootScope) {

      var gotoDailyChartView = gotoDailyChartView;
      var gotoDailyChartViewCompare = gotoDailyChartViewCompare;
      var updateGraphView = updateGraphView;

      var service = {
        gotoDailyChartView: gotoDailyChartView,
        gotoDailyChartViewCompare:gotoDailyChartViewCompare,
        updateGraphView:updateGraphView
      };
      return service;

      function gotoDailyChartViewCompare(date){
        resetGraphData(null,date);
        var jsonGraphData = TpcDailyGraphConfig.dailysChartConfig.graphData;
        var jsonArray = [];
        for (var i = 0; i < jsonGraphData.length; i++) {
          var innerArray = jsonGraphData[i].adhocPricingResults;
          for(var j =0 ; j < innerArray.length; j++){
            if(TpHelperService.getTSForOutDate(innerArray[j].outDate) === TpHelperService.getTimeStamp(date)){
              jsonArray.push(innerArray[j]);
              break;
            }
          }
        }
        var totalMap = new Object();
        var markets = new Object();
        var yqyr = {name:'YQYR',color:'#f15c80',mkt:markets,total:totalMap, data:[]};
        var tax = {name:'Tax',color:'#90ed7d',mkt:markets,total:totalMap,data:[]};
        var surcharge = {dataLabels: {
          enabled: true,
          rotation: 0,
          formatter:function(){
            return Highcharts.numberFormat(this.y, 0,'','');
          },
          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray',
          y:-10
        },name:'Surcharge',color:'#f7a35c' ,mkt:markets,total:totalMap,data:[]};
        var basefare ={name:'Base Amt',color:'#7cb5ec',mkt:markets,total:totalMap,data:[]};
        var cats = [];
        var totalAmt = 0;
        for (var i = 0; i < jsonArray.length; i++) {
          var obj = jsonArray[i];
          cats.push(obj.outboundFareClass);
          yqyr.data.push(TpHelperService.formatAmount(obj.yqyrAmt, 2));
          tax.data.push(TpHelperService.formatAmount(obj.taxAmt, 2));
          surcharge.data.push(TpHelperService.formatAmount(obj.surChgAmt, 2));
          basefare.data.push(TpHelperService.formatAmount(obj.baseAmt, 2));
          totalAmt = TpHelperService.formatAmount(obj.baseAmt, 2) + TpHelperService.formatAmount(obj.surChgAmt, 2) +
          TpHelperService.formatAmount(obj.taxAmt, 2) + TpHelperService.formatAmount(obj.yqyrAmt, 2);
          totalMap[TpHelperService.getFormatedDate(TpHelperService.getTSForOutDate(obj.outDate))] = totalAmt;
          var mkt = obj.origin + '-' + obj.destination + '-' + obj.carrierCode + ' ' + obj.outboundFareClass + ' ' + date;
          markets[obj.outboundFareClass] = mkt;
        }
        TpcDailyGraphConfig.dailysChartConfig.options.title.text = date;
        setGraphData(cats,surcharge,tax,yqyr,basefare);
      }

      function resetGraphData(name,date){
        TpcDailyGraphConfig.dailysChartConfig.series.splice(0);
        TpcDailyGraphConfig.dailysChartConfig.options.xAxis.categories.splice(0);
        if(TpcDailyGraphConfig.dailysChartConfig.seriesName === '' || name !== undefined){
          TpcDailyGraphConfig.dailysChartConfig.seriesName = name;
          TpcDailyGraphConfig.dailysChartConfig.currDate = date;
        }
      }

      function setGraphData(cats,surcharge,tax,yqyr,basefare){
        TpcDailyGraphConfig.dailysChartConfig.options.xAxis.categories.push.apply(TpcDailyGraphConfig.dailysChartConfig.options.xAxis.categories, cats);
        TpcDailyGraphConfig.dailysChartConfig.series.push(surcharge);
        TpcDailyGraphConfig.dailysChartConfig.series.push(tax);
        TpcDailyGraphConfig.dailysChartConfig.series.push(yqyr);
        TpcDailyGraphConfig.dailysChartConfig.series.push(basefare);

        TpcDailyGraphConfig.dailysChartConfig.showDailyGraph = true;
        updateGraphView();
      }

      function updateGraphView(){
        var type = TpHelperService.getFirstSelected(stacked);
        if (type === 'Stacked') {
          TpcDailyGraphConfig.dailysChartConfig.options.plotOptions.column.stacking = 'normal';
          TpcDailyGraphConfig.dailysChartConfig.series[0].dataLabels.y = -10;
        } else {
          TpcDailyGraphConfig.dailysChartConfig.options.plotOptions.column.stacking = '';
          TpcDailyGraphConfig.dailysChartConfig.series[0].dataLabels.y = -1;
        }
        $rootScope.$broadcast('daily-graph-congifured', { configs: {showDailyGraph:true} });
      }

      function gotoDailyChartView(name, date){
        resetGraphData(name,date);
        var jsonGraphData = TpcDailyGraphConfig.dailysChartConfig.graphData;
        var jsonArray;
        for (var i = 0; i < jsonGraphData.length; i++) {
          var comboName = jsonGraphData[i].marketFareClassCombo.split('-');
          if (TpHelperService.formatMarket(comboName[0]) + ' '+comboName[1] ===
              TpcDailyGraphConfig.dailysChartConfig.seriesName) {
            jsonArray = jsonGraphData[i].adhocPricingResults;
            break;
          }
        }
        var totalMap = new Object();
        var markets = new Object();
        var yqyr = {name:'YQYR',color:'#f15c80',mkt:markets,total:totalMap, data:[]};
        var tax = {name:'Tax',color:'#90ed7d',mkt:markets,total:totalMap,data:[]};
        var surcharge = {dataLabels: {
          enabled: true,
          rotation: 0,
          formatter:function(){
            return Highcharts.numberFormat(this.y, 0,'','');
          },
          color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray',
          y:-10
        },name:'Surcharge',color:'#f7a35c' ,mkt:markets,total:totalMap,data:[]};
        var basefare ={name:'Base Amt',color:'#7cb5ec',mkt:markets,total:totalMap,data:[]};
        var cats = [];
        var totalAmt = 0;
        for (var i = 0; i < jsonArray.length && cats.length < 7; i++) {
          var obj = jsonArray[i];
          if (TpHelperService.getTSForOutDate(obj.outDate) < date){
            continue;
          }
          cats.push(TpHelperService.getFormatedDate(TpHelperService.getTSForOutDate(obj.outDate)));
          yqyr.data.push(TpHelperService.formatAmount(obj.yqyrAmt, 2));
          tax.data.push(TpHelperService.formatAmount(obj.taxAmt, 2));
          surcharge.data.push(TpHelperService.formatAmount(obj.surChgAmt, 2));
          basefare.data.push(TpHelperService.formatAmount(obj.baseAmt, 2));
          totalAmt = TpHelperService.formatAmount(obj.baseAmt, 2) + TpHelperService.formatAmount(obj.surChgAmt, 2) +
          TpHelperService.formatAmount(obj.taxAmt, 2) + TpHelperService.formatAmount(obj.yqyrAmt, 2);
          totalMap[TpHelperService.getFormatedDate(TpHelperService.getTSForOutDate(obj.outDate))] = totalAmt;
          var mkt = obj.origin + '-' + obj.destination + '-' + obj.carrierCode + ' ' + obj.outboundFareClass + ' ' + TpHelperService.getFormatedDate(date);
          markets[TpHelperService.getFormatedDate(TpHelperService.getTSForOutDate(obj.outDate))] = mkt;
        }
        TpcDailyGraphConfig.dailysChartConfig.options.title.text = name;
        setGraphData(cats,surcharge,tax,yqyr,basefare);

      };

    }
})();
