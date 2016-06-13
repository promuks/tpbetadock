(function () {
  angular.module('app.totalprice.calculator').factory('TpcDownloadService',TpcDownloadService);

  TpcDownloadService.$inject = ['$q','TpHelperService','TpcDownloadDataService','downloadHeader','downloadOrder','TpSearchResponse'];

  function TpcDownloadService ($q,TpHelperService,TpcDownloadDataService,downloadHeader,downloadOrder,TpSearchResponse) {
    var getDownloadData = getDownloadData;
    var getDownloadHeader = getDownloadHeader;
    var getDownloadOrder = getDownloadOrder;
    var getDownloadFileName = getDownloadFileName;

    var service = {
      getDownloadData: getDownloadData,
      getDownloadHeader:getDownloadHeader,
      getDownloadOrder:getDownloadOrder,
      getDownloadFileName:getDownloadFileName
    };

    return service;

    function getDownloadData(selectedFcs) {
      var queryObj = {};
      queryObj.queryId = TpSearchResponse.queryId;
      queryObj.isDownloadRequest = true;
      queryObj.marketFareClassList = selectedFcs;
      var deferred = $q.defer();
      TpcDownloadDataService.downloadData(queryObj).then(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function getDownloadHeader() {
      return downloadHeader;
    }

    function getDownloadOrder() {
      return downloadOrder;
    }

    function getDownloadFileName() {
      var tms = TpHelperService.getFormatedDate(new Date().getTime());
      return "TPCExport_"+tms+".csv";
    }
  }
})();


