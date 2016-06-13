'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('SummaryFilters', SummaryFilters);

  SummaryFilters.$inject = ['CalculatorRequest','TpHelperService','graphOptions'];

  function SummaryFilters(CalculatorRequest,TpHelperService, graphOptions) {

    var summaryFilters = {
      amountOptions: graphOptions.amountOptions,
      cabinOptions: graphOptions.cabinOptions,
      cabinList: [],
      opList: [],
      odcList: [],
      opOptions: graphOptions.opOptions,
      odcOptions: [],
      amounts:[],
      populateOdc: populateOdc
    };

    summaryFilters.amounts.push(summaryFilters.amountOptions[0]);
    summaryFilters.cabinList.push(summaryFilters.cabinOptions[0]);
    summaryFilters.opList.push(summaryFilters.opOptions[0]);

    function populateOdc(jsonData){
      summaryFilters.odcOptions.splice(0);
      summaryFilters.odcList.splice(0);
      summaryFilters.cabinList.splice(0);
      angular.forEach(summaryFilters.cabinOptions, function(cabOption,index) {
        if (index > 0) cabOption.selected = false;
      });
      summaryFilters.cabinList.push(summaryFilters.cabinOptions[0]);
      if(jsonData == undefined || jsonData.length === 0){
        var item = {};
        item.label = 'No Markets With Data';
        item.id = 'No Markets With Data';
        item.selected = true;
        summaryFilters.odcOptions.push(item);
        summaryFilters.odcList.push.apply(summaryFilters.odcList, summaryFilters.odcOptions);
        return;
      }

      var odcs = [];
      var cabinMaps = {};
      angular.forEach(jsonData, function(market) {
        var item = {};
        item.label = TpHelperService.formatMarket(market.market);
        item.id = market.market;
        item.selected = true;
        if(odcs.indexOf(item.id) === -1){
          odcs.push(item.id);
          this.push(item);
        }
        if(cabinMaps[market.market] == undefined || cabinMaps[market.market] !== 'Economy'){
          cabinMaps[market.market] = market.cabinType;
        }
      },summaryFilters.odcOptions);
      summaryFilters.odcList.push.apply(summaryFilters.odcList, summaryFilters.odcOptions);
      for (var key in cabinMaps) {
        if(cabinMaps[key] !== 'Economy'){
          summaryFilters.cabinList.push(getCabinOption(cabinMaps[key]));
        }
      }
    }

    function getCabinOption(cabinId){
      var cabOps = graphOptions.cabinOptions;
      for (var i = 0;  i < cabOps.length; i++)
      {
        var cab = cabOps[i];
        if (cab.id === cabinId || cab.label === cabinId) {
          cab.selected = true;
          return cab;
        }
      }
    };

    return summaryFilters;

  }
})();
