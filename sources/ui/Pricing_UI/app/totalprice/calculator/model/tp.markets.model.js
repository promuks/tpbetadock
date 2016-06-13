'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('MarketsFilters', MarketsFilters);

  MarketsFilters.$inject = ['marketGraphOptions','TpHelperService'];

  function MarketsFilters (marketGraphOptions,TpHelperService) {

    var marketsFilters = {
      amountOptions: marketGraphOptions.amountOptions,
      cabinOptions: [],
      cabinList: [],
      odcList: [],
      odcOptions: [],
      routeList: [],
      routeOptions: [],
      amounts:[],
      populateOdc: populateOdc,
      populateRoute: populateRoute,
      populateCabins:populateCabins
    };

    marketsFilters.amounts.push(marketsFilters.amountOptions[0]);

    function populateCabins(cabins) {
      if(cabins.length > 0) {
        marketsFilters.cabinList.splice(0);
        marketsFilters.cabinOptions.splice(0);
        angular.forEach(cabins, function (value) {
          var cab = getCabinOption(value);
          cab.selected = true;
          this.push(cab);
        }, marketsFilters.cabinOptions);
      }else{
        marketsFilters.cabinList.push(marketsFilters.cabinOptions[0]);
      }
      marketsFilters.cabinList.push.apply(marketsFilters.cabinList, marketsFilters.cabinOptions);
    }

    function populateRoute(graphData) {
      if(graphData.length > 0) {
        marketsFilters.routeList.splice(0);
        marketsFilters.routeOptions.splice(0);
        var listOfCabin = TpHelperService.getListOfString(marketsFilters.cabinList,'id');
        var listOfMarkets = TpHelperService.getListOfString(marketsFilters.odcList,'id');
        var routeStrs = [];
        for (var i = 0; i < graphData.length; i++) {
          if (jQuery.inArray(graphData[i].market, listOfMarkets) !== -1 &&
            jQuery.inArray(graphData[i].adhocPricingResults[0].cabinType, listOfCabin) !== -1) {
            angular.forEach(graphData[i].adhocPricingResults, function (value) {
              var strs = TpHelperService.chunkString(value.outRoute,3);
              var route =  {id:value.outRoute , label:strs.join('-') ,selected: true};
              if (jQuery.inArray(value.outRoute, routeStrs) === -1) {
                routeStrs.push(value.outRoute);
                this.push(route);
              }
            }, marketsFilters.routeList);
          }
        }
        marketsFilters.routeOptions.push.apply(marketsFilters.routeOptions, marketsFilters.routeList);
      }else{
        marketsFilters.routeList.push({});
      }
    }



    function populateOdc(mkts){
      marketsFilters.odcOptions=[];
      marketsFilters.odcList=[];
      if(mkts.length > 0) {
        angular.forEach(mkts, function (value) {
          var item = {};
          item.label = value;
          item.id = value.replace(/-/g,'');
          item.selected = true;
          this.push(item);
        }, marketsFilters.odcOptions);
      }else{
        marketsFilters.odcList.push(marketsFilters.odcOptions[0]);
      }
      marketsFilters.odcList.push.apply(marketsFilters.odcList, marketsFilters.odcOptions);
    }

    function getCabinOption(cabinId){
      var cabOps = marketGraphOptions.cabinOptions;
      for (var i = 0;  i < cabOps.length; i++)
      {
        if (cabOps[i].id === cabinId || cabOps[i].label === cabinId) {
          return cabOps[i];
        }
      }
    };
    return marketsFilters;

  }
})();
