'use strict';
(function () {
  angular.module('app.totalprice.calculator').factory('TpProperties', TpProperties);

  TpProperties.$inject = ['$http'];

  function TpProperties($http) {

    var tpPropertyConstants = {
      TP_BETA_ALLWD_ROLES:'fm.app.allowed.roles',
      TP_BETA_GRID_URL:'tp.beta.grid.data.service.url',
      TP_BETA_SUMMRY_URL:'tp.beta.summary.data.service.url',
      TP_BETA_ONEDAY_URL:'tp.beta.one.day.data.service.url',
      TP_BETA_MARKETS_URL:'tp.beta.markets.graph.data.service.url',
      TP_BETA_ENABLE_LOG:'fm.app.enable.log',
      TP_BETA_WRAPPER_URL:'tp.beta.calc.wrapper.service.url',
      TP_BETA_HDR_STTS_URL:'tp.beta.calc.header.status.service.url',
      TP_BETA_LKPUP_URL:'tp.beta.directory.lookup.service.url'
    };

    var tpProperties = {
      gridDataServiceUrl: 'http://localhost:9993/api/fares/fareClassAndCabinByMkt',
      marketsgraphDataServiceUrl: 'http://localhost:9993/api/fares/pricingDetailsByMktAndFareClass',
      oneDayGraphDataServiceUrl: 'http://localhost:9993/api/fares/oneDayAmountsByMktCabinRequest',
      summarygraphDataServiceUrl: 'http://localhost:9993/api/fares/amountsByMktAndCabin',
      calcWrapperServiceUrl: 'http://localhost:9995/api/calc/process',
      headerStatusServiceUrl: 'http://localhost:9993/api/fares/status/',
      directoryLookupServiceUrl: 'http://localhost:9996/ws/lookup/search/',
      requiresServer:false,
      enableLog:true,
      allowedRoles: [], // for future considerations...
     /* populateProperties:populateProperties,*/
      populateTpProperties:populateTpProperties
    };

/*    // not required
    function populateProperties(data){
      tpProperties.gridDataServiceUrl=data.gridDataServiceUrl;
      tpProperties.marketsgraphDataServiceUrl=data.marketsgraphDataServiceUrl;
      tpProperties.oneDayGraphDataServiceUrl=data.oneDayGraphDataServiceUrl;
      tpProperties.summarygraphDataServiceUrl=data.summarygraphDataServiceUrl;
      tpProperties.requiresServer=data.requiresServer;
      tpProperties.enableLog=data.enableLog;
      tpProperties.allowedRoles=data.allowedRoles;
      tpProperties.calcWrapperServiceUrl=data.calcWrapperServiceUrl;
      tpProperties.headerStatusServiceUrl=data.headerStatusServiceUrl;
      tpProperties.directoryLookupServiceUrl=data.directoryLookupServiceUrl;
    }*/

    function populateTpProperties(data){
      for(var property in data){
        if(tpPropertyConstants.TP_BETA_ALLWD_ROLES===property){
          tpProperties.allowedRoles=data[property].split(',');
        }
        if(tpPropertyConstants.TP_BETA_GRID_URL===property){
          tpProperties.gridDataServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_SUMMRY_URL===property){
          tpProperties.summarygraphDataServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_ONEDAY_URL===property){
          tpProperties.oneDayGraphDataServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_MARKETS_URL===property){
          tpProperties.marketsgraphDataServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_ENABLE_LOG===property){
          tpProperties.enableLog=(data[property] === 'true');
        }
        if(tpPropertyConstants.TP_BETA_REQ_SERVER===property){
          tpProperties.requiresServer=(data[property] === 'true');
        }
        if(tpPropertyConstants.TP_BETA_WRAPPER_URL===property){
          tpProperties.calcWrapperServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_HDR_STTS_URL===property){
          tpProperties.headerStatusServiceUrl=data[property];
        }
        if(tpPropertyConstants.TP_BETA_LKPUP_URL===property){
          tpProperties.directoryLookupServiceUrl=data[property];
        }
      }
    }

    return tpProperties;
  }
})();

