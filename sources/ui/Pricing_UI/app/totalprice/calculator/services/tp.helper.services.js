'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpHelperService', ['$filter', function($filter) {
    return {
      formatAmount: function(num,decimals){
        return num/Math.pow(10,decimals);
      },
      formatMarket:function(market){
        var org = market.substr(0,3);
        var dest = market.substr(3,3);
        var carr = market.substr(6);
        return org+'-'+dest+'-'+carr;
      },
      getFormatedDate: function(UNIX_timestamp){
        return Highcharts.dateFormat('%d%b%y', UNIX_timestamp).toUpperCase();
      },
      getTSForOutDate: function(dateToConvert){
        dateToConvert = dateToConvert + '';
        var cYear = dateToConvert.substring(0, 4);
        var cMonth = dateToConvert.substring(4,6);
        var cDay = dateToConvert.substring(6);
        return new Date(cYear, cMonth-1, cDay, 0, 0, 0).getTime();
      },
      getTimeStamp: function (dateToConvert) {
        var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
          "AUG", "SEP", "OCT", "NOV", "DEC");
        if(isNaN(dateToConvert) === false){
          return dateToConvert;
        }
        if(dateToConvert.length === 6){
          dateToConvert = '0'+dateToConvert;
        }
        var cYear = "20" + dateToConvert.substring(5, dateToConvert.length);
        var cMonth = jQuery.inArray(dateToConvert.substring(2, 5).toUpperCase(),
          m_names);
        var cDay = dateToConvert.substring(0, 2);
        return new Date(cYear, cMonth, cDay, 0, 0, 0).getTime();
      },
      getListOfString : function(myObject,fieldName){
        var myArray = [];
        for(var i in myObject) {
          myArray.push(myObject[i][fieldName]);
        }
        return myArray;
      },
      getFirstSelected : function(myObject){
        var selected = '';
        for(var i in myObject) {
          if(myObject[i].selected === true){
            selected = myObject[i].id;
            break;
          }
        }
        return selected;
      },
      getFirstDayValue: function (dateToConvert) {
        var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
          "AUG", "SEP", "OCT", "NOV", "DEC");
        var cYear = "20" + dateToConvert.substring(5, dateToConvert.length);
        var cMonth = jQuery.inArray(dateToConvert.substring(2, 5).toUpperCase(),
          m_names);
        var cDay = dateToConvert.substring(0, 2);
        return cDay + "." + (cMonth + 1) + "." + cYear;;
      },
      getDays: function (a, b) {
        if (a === undefined || a.length === 0) return 365;

        var DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
        var parts = a.split('.');
        var date1 = new Date(parts[2], parts[1] - 1, parts[0]);
        parts = b.split('.');
        var date2 = new Date(parts[2], parts[1] - 1, parts[0]);
        var days = ((date1.getTime() - date2.getTime()) / DAY_IN_MILLIS);
        days = Math.round(days);
        return days;
      },
      getDaysForTS: function (a, b) {
        if (a === undefined || a.length === 0) return 180;
        var DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
        var days = ((a - b) / DAY_IN_MILLIS);
        days = Math.round(days);
        return days;
      },
      addDaysToDate:function(tt,days) {
        var date = new Date(tt);
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        return newdate.getTime();
      },
      createQueryParamsFromOptions:function(queryId,odcs,cabins){
        var queryObj = {};
        queryObj.queryId=queryId;
        queryObj.marketList = [];
        queryObj.cabinTypeList = [];

        angular.forEach(odcs, function(value) {
          this.push(value.id);
        }, queryObj.marketList);

        angular.forEach(cabins, function(value) {
          this.push(value.id);
        }, queryObj.cabinTypeList);
        return queryObj;
      },
      createQueryParamsFromStrings:function(queryId,odcs,cabin){
        var queryObj = {};
        queryObj.queryId=queryId;
        queryObj.marketList = [];
        queryObj.cabinTypeList = [];

        queryObj.marketList.push(odcs);
        queryObj.cabinTypeList.push(cabin);
        return queryObj;
      },
      chunkString:function(str, length) {
        return str.match(new RegExp('.{1,' + length + '}', 'g'));
      },
      getDateAsInteger:function(strDate){
        if (strDate === undefined || strDate.length === 0) {
          return parseInt($filter('date')(new Date().toISOString().substring(0, 10),'yyyyMMdd'));
        }else if(isNaN(strDate) === false){
          return strDate;
        } else {
          var pattern = /(\d{2})(\d{3})(\d{2})/;

          var sdate = new Date(strDate.replace(pattern, 'yyyyMMdd'));

          var day = strDate.substring(0,2);

          var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
            "AUG", "SEP", "OCT", "NOV", "DEC");

          var month = m_names.indexOf(strDate.substring(2, 5).toUpperCase());

          var year = strDate.substring(5,7);

          return parseInt($filter('date')(new Date(('20'+year),month,day).toISOString().substring(0, 10),'yyyyMMdd'));
        }
      },
      getDisplayDate:function(intDate){
        var m_names = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
          "AUG", "SEP", "OCT", "NOV", "DEC");
        if (intDate === undefined || intDate.length === 0) {
          return $filter('date')(new Date().toISOString().substring(0, 10), 'ddMMMyy');
        } else {
          var strDate = intDate.toString();
          var cDay = strDate.substring(6);
          var cMonth = m_names[strDate.substring(4, 6)-1];
          var cYear = strDate.substring(2,4);
          strDate=cDay+cMonth+cYear;
          return $filter('date')(new Date(Date.parse(strDate)).toISOString().substring(0, 10), 'ddMMMyy');
        }
      },
      getOnewayAsBoolean:function(oneWay){
        if (typeof oneWay === 'object' && oneWay[0].id === 'OW') {
          return true;
        }
        return false;
      }
    };
  }]);
})();
