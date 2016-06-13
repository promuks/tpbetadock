'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcMarketsGraphsConfig', TpcMarketsGraphsConfig);

  TpcMarketsGraphsConfig.$inject = ['TpcDailyGraphService','$timeout','MarketsFilters','graphDefaults','Analytics'];

  function TpcMarketsGraphsConfig(TpcDailyGraphService,$timeout,MarketsFilters,graphDefaults,Analytics) {
    var marketsGraphsOption = {
      chart: {
        type: 'line',
        zoomType: 'x',
        events: {
          redraw: function () {
          }
        },
        resetZoomButton: {
          position: {
            x: 0,
            y: 0
          },
          relativeTo: 'chart',
          theme: {
            fill: '#337ab7',
            stroke: 'white',
            style: {
              color: 'white'
            },
            r: 0,
            states: {
              hover: {
                fill: '#41739D',
                style: {
                  color: 'silver'
                }
              }
            }
          }
        }
      },
      navigation: {
        buttonOptions: {
          enabled: false
        }
      },
      plotOptions: {
        line: {
          gapSize: 1,
          marker: {
            enabled: false
          }
        },
        series: {
          cursor: 'pointer',
          events:{
          },
          point: {
            events: {
              click: function (event) {
                Analytics.trackEvent('Results Page', 'Clicked', 'Daily Price Breakdown');
                $timeout(TpcDailyGraphService.gotoDailyChartView(this.series.name,this.category), 100);
              }
            }
          }
        }
      },
      xAxis: {
        title: {
          text: ''
        },
        type: 'datetime',
        tickInterval: 30 * 24 * 3600 * 1000,
        minTickInterval:1 * 24 * 3600 * 1000,
        minRange: 1 * 24 * 3600 * 1000,
        min: graphDefaults.startDate,
        max: graphDefaults.endDate,
        labels: {
          enabled: true,
          rotation:0,
          step: 1,
          formatter: function () {
            return '<a ng-click="vmmg.xLabelClick(\''+ Highcharts.dateFormat('%e%b%y',this.value) +'\')" ga-track-event="[\'Results Page\', \'Clicked\', \'Daily Price Breakdown by Date\']">' + Highcharts.dateFormat('%e%b%y',this.value)  + '</a>';
          },
          useHTML: true
        },
        dateTimeLabelFormats: {
          day: '%e%b%y',
          month: '%b%y',
          year: '%b%y'
        },
        events: {
          setExtremes: function (event) {
            var start = Math.ceil(event.min);
            var end = Math.floor(event.max);
            var frequency = Math.floor((end - start) / (1 * 24 * 3600 * 1000));

            if(!frequency || frequency > 31){
              this.options.labels.rotation= -5;
              this.options.tickInterval =  30 * 24 * 3600 * 1000;
            }else{
              this.options.labels.rotation= -45;
              this.options.tickInterval =  1 * 24 * 3600 * 1000;
            }
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        min: -10,
        max: 10,
        labels: {
          enabled: true,
          formatter: function () {
            return Highcharts.numberFormat(this.value, 0, "", "")
          }
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {
        formatter: function () {
          var marketfc = this.series.name.split(' ');
          var dateValue = Highcharts.dateFormat('%d%b%y', this.x).toUpperCase();
          return '<b>'
            + 'Market: ' + '</b>'
            + marketfc[0]
            + '<b> Fare Class: </b>'
            + marketfc[1]
            +'<br><b>'
            + 'Date: ' + '</b>'
            + dateValue
            + ' <b> '+MarketsFilters.amounts[0].name+':</b>'
            + Highcharts.numberFormat(this.y, 0,"","")
            + '<br><b>Routing:</b>' + this.series.options.route[this.x];
        }
      },
      rangeSelector: {
        enabled: false
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 1
      }
    };

    var marketsGraphsConfig = {
      options:marketsGraphsOption,
      series: [],
      loading: false,
      title: {
        text: '',
        style: {
          fontWeight: 'normal',
          fontSize: '15px',
          color: Highcharts.getOptions().colors[1],
          fill: Highcharts.getOptions().colors[1]
        }
      }
    }

    var service = {
      marketsGraphsConfig:marketsGraphsConfig
    };

    return service;
  }
})();
