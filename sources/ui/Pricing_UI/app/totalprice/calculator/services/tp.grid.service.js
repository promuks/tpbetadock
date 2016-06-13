(function () {
  angular.module('app.totalprice.calculator').factory('TpGridService', TpGridService);

  TpGridService.$inject = ['TpcGridDataService','TpHelperService','$rootScope','$timeout','TpSearchResponse'];

  function TpGridService (TpcGridDataService,TpHelperService,$rootScope,$timeout,TpSearchResponse) {
    var getSelectedFareClasses = getSelectedFareClasses;
    var getSelectedCabinTypes = getSelectedCabinTypes;
    var showFareClassForSeries = showFareClassForSeries;
    var getSelectedMarkets = getSelectedMarkets;
    var loadGridData = loadGridData;
    var newMyApply = newMyApply;
    var setData = setData;
    var resetData = resetData;
    var getData = getData;
    var fareclassGridData = new Array();
    var firstTime;

var myApply;
    var service = {
      getSelectedFareClasses:getSelectedFareClasses,
      getSelectedCabinTypes:getSelectedCabinTypes,
      getSelectedMarkets:getSelectedMarkets,
      showFareClassForSeries:showFareClassForSeries,
      loadGridData:loadGridData,
      setData:setData,
      getData:getData,
      resetData:resetData,
      getMainGridData:getMainGridData,
      getDetailGridData:getDetailGridData,
      newMyApply:newMyApply,
      firstTime:firstTime
     };
    return service;

    function getMainGridData(){
      var mainGridData = Grids['mainGrid'];
      var allRows = mainGridData.Rows;
      var avialable =  new Array();

      var rows = [];

      angular.forEach(allRows, function (row) {
        if (row.id != 'tpCalcMainToolBar' && row.id!='NoData' && row.id != 'Header' && row.id != 'AR1' && row.id !='tpCalculatorMainFilter') {
          var rowData = {
            market:row.market,
            cabinType: row.cabinType,
            fareclass: row.fareclass
          };
          avialable.push(rowData);
        }
      });
      return avialable;
    }

    function getDetailGridData(){
      var detailGridData = Grids['detailGrid'];
      var allRows = detailGridData.Rows;
      var selected =  new Array();

      angular.forEach(allRows, function (row) {
        if (row.id != 'tpCalcDetailToolBar' && row.id!='NoData' && row.id != 'Header' && row.id != 'AR1' && row.id !='tpCalculatorDetailFilter') {
          var rowData = {
            market:row.market,
            cabinType: row.cabinType,
            fareclass: row.fareclass
          };
          selected.push(rowData);
        }
      });
      return selected;
    }

    function setData(avialable,selected) {
      //You could also set specific attribute of the form data instead
      fareclassGridData.avialable=avialable;
      fareclassGridData.selected=selected;
    }

    function getData(){
      return fareclassGridData;
    }

    function resetData(){
      fareclassGridData.avialable=[];
      fareclassGridData.selected=[];
      fareclassGridData=new Array();
    }

    function newMyApply(newMyApply){
      myApply = newMyApply;
    }
    function formatResponse(data){
      var engineResponse = {
        mergedFares: []
      };

      angular.forEach(data, function (mergedFare) {

        var fare = {
          market:mergedFare.origin+"-"+mergedFare.destination+"-"+mergedFare.carrierCode,
          cabinType: mergedFare.cabinType.replace(/([a-z])([A-Z])/g, '$1 $2'),
          fareclass: mergedFare.outboundFareClass
        };
        engineResponse.mergedFares.push(fare);
      });
      return engineResponse;
    }

    function getFcs(data){
      var fcs=[];
      angular.forEach(data, function (mergedFare) {
        fcs.push(mergedFare.outboundFareClass);
      });
      return fcs;
    }

    function showFareClassForSeries(marketCabin) {
      var data = marketCabin.split(' ');
      var queryObj = {};
      queryObj.queryId=TpSearchResponse.queryId;
      var myDataPromise = TpcGridDataService.getFareClassesData(queryObj);
      myDataPromise.then(function(result) {
        var fcGrid = Grids['fcGrid'];
        if (fcGrid != null) {
          fcGrid.Dispose();
        }
        var D = new TDataIO();
        D.Layout.Url = "totalprice/calculator/config/tpCalcResultGridDef.xml";
        var newData = formatResponse(result);
        D.Data.Data = fcGridData(newData.mergedFares);
        var tg1 = TreeGrid(D, "fcGrid","fcGrid");
        tg1.Tag='fcMain';
        tg1.id='fcGrid';
        SetEvent("OnSuggest", "fcGrid", function(G,row,col,val,suggestMenu){gridOnFareClassSearch(G,row,col,val,suggestMenu);});
        $rootScope.$broadcast('summary-grid-configured', { configs: {showSummaryGrid:true} });
      });
    }


    function getSelectedFareClasses() {
      var detailGridData = Grids['detailGrid'];
      var allRows = detailGridData.Rows;
      var selectedFcs =  new Array();

      angular.forEach(allRows, function (row) {
        if (row.id != 'tpCalcDetailToolBar' && row.id!='NoData' && row.id != 'Header' && row.id != 'AR1' && row.id !='tpCalculatorDetailFilter') {
          var markets=[];
          markets.push(row.market.replace(/-/g,''));
          markets.push(row.fareclass);
          selectedFcs.push(markets);
        }
      });
      return selectedFcs;
    }

    function getSelectedCabinTypes() {
      var detailGridData = Grids['detailGrid'];
      var allRows = detailGridData.Rows;
      var selectedCabins =  new Array();

      angular.forEach(allRows, function (row) {
        if (row.id != 'tpCalcDetailToolBar' && row.id!='NoData' && row.id != 'Header' && row.id != 'AR1' && row.id !='tpCalculatorDetailFilter') {
          if (jQuery.inArray(row.cabinType, selectedCabins) === -1){
            selectedCabins.push(row.cabinType);
          }
        }
      });
      return selectedCabins;
    }

    function getSelectedMarkets() {
      var detailGridData = Grids['detailGrid'];
      var allRows = detailGridData.Rows;
      var selectedMkts =  new Array();

      angular.forEach(allRows, function (row) {
        if (row.id != 'tpCalcDetailToolBar' && row.id!='NoData' && row.id != 'Header' && row.id != 'AR1' && row.id !='tpCalculatorDetailFilter') {
          if (jQuery.inArray(row.market, selectedMkts) === -1){
            selectedMkts.push(row.market);
          }
        }
      });
      return selectedMkts;
    }

    function fcGridData(data) {

      //convert the Service JSON data to the format that the grid needs
      var bodyResponse = {Body: [[]]};
      for (var i = 0; i < data.length; ++i) {
        var marketData = data[i];
        var ejsGridItem = angular.copy(marketData);
        ejsGridItem.Def = 'Node';
       // ejsGridItem.Expanded = 0;
        bodyResponse.Body[0].push(ejsGridItem);
      }
      return bodyResponse;
    }

    function loadGridData(gridData,firstTime) {

      if (gridData != null && gridData != 'undefined') {
        //remove the grid from the page
        var mainGrid = Grids['mainGrid'];
        if (mainGrid != null) {
          mainGrid.Dispose();
          resetData();
        }
        var detailGrid = Grids['detailGrid'];
        if (detailGrid != null) {
          detailGrid.Dispose();
          resetData();
        }

       //create new grid with new data
        var D = new TDataIO();
        D.Layout.Url = "totalprice/calculator/config/tpCalcResultGridDef.xml";

        if(firstTime) {
          var newData = formatResponse(gridData.avialable);
          D.Data.Data = fcGridData(newData.mergedFares);
        }
        else{
          D.Data.Data =fcGridData(gridData.avialable);
        }

        var tg1 = TreeGrid(D,"mainGrid","mainGrid");
        tg1.Tag='mainGrid';

       // var suggestFcsMenu="{Items:" + JSON.stringify(getFcs(gridData)) + "};";

        SetEvent("OnSuggest", "mainGrid", function(G,row,col,val,menu){gridOnFareClassSearch(G,row,col,val,menu);});



        var D1 = new TDataIO();
        D1.Layout.Url = "totalprice/calculator/config/tpCalcResultGridSelectedDef.xml";
        D1.Data.Data = fcGridData(gridData.selected);

        var tg2 = TreeGrid(D1,"detailGrid","detailGrid");
        tg2.Tag='detailGrid';
        SetEvent("OnSuggest", "detailGrid", function(G,row,col,val,suggestMenu){gridOnFareClassSearch(G,row,col,val,suggestMenu);});

       // $timeout( service.loaded = true , 100);
        //service.loaded = true;
        //myApply();
        return {
          detailGrid:tg2,
          mainGrid:tg1
         }
      }
    }

  }
})();
