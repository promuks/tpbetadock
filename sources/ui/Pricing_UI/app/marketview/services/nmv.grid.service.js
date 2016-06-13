/**
 * Created by atp1lxh on 8/27/2015.
 */
(function () {
  angular.module('app.marketview').factory('NmvGridService', NmvGridService);

  NmvGridService.$inject = ['NmvGridDataService'];

  function NmvGridService (NmvGridDataService) {

    var loadGridData = loadGridData;

    var service = {
      loadGridData:loadGridData
    };
    return service;

    function formatResponse(data){
      var engineResponse = {
        mergedFares: []
      };
      angular.forEach(data, function (mergedFare) {
        var fare = {
          market:mergedFare.origin+"-"+mergedFare.destination+"-"+mergedFare.carrierCode,
          cabinType: mergedFare.cabinType,
          fareclass: mergedFare.outboundFareClass
        };
        engineResponse.mergedFares.push(fare);
      });
      return engineResponse;
    }

    function fcGridData(data) {
      //convert the Service JSON data to the format that the grid needs
      var bodyResponse = {Body: [[]]};
      for (var i = 0; i < data.length; ++i) {
        var marketData = data[i];
        var ejsGridItem = angular.copy(marketData);
        ejsGridItem.Def = 'Node';
        ejsGridItem.Expanded = 0;
        bodyResponse.Body[0].push(ejsGridItem);
      }
      return bodyResponse;
    }

    function loadGridData(gridData) {

      if (gridData != null && gridData.length > 0) {
        //remove the grid from the page
        var mainGrid = Grids['mainGrid'];
        if (mainGrid != null) {
          mainGrid.Dispose();
        }
        //create new grid with new data
        var D = new TDataIO();
        D.Layout.Url = "marketview/config/nmvSavedSearchesResultsDef.xml";
        var newData = formatResponse(gridData);
        D.Data.Data = fcGridData(newData.mergedFares);
        var tg1 = TreeGrid(D, "mainGrid");

        return {
          mainGrid:tg1
        }
      }
    }

  }
})();
