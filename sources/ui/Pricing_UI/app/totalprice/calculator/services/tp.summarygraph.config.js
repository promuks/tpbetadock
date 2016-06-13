'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcSummaryGraphConfig', TpcSummaryGraphConfig);

  TpcSummaryGraphConfig.$inject = ['graphDefaults','SummaryFilters','TpcOneDayGraphConfig','TpcOneDayGraphService','Analytics'];

  function TpcSummaryGraphConfig( graphDefaults,SummaryFilters,TpcOneDayGraphConfig,TpcOneDayGraphService,Analytics) {
    var gMin = graphDefaults.gMin;
    var gMax = graphDefaults.gMax;
    var startDate = graphDefaults.startDate;
    var endDate = graphDefaults.endDate;

    var summaryGraphOption = {
      chart: {
        type: 'line',
        events: {
          redraw: function () {
          }
        },
        zoomType: 'x',
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
          marker: {
            enabled: false
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (event) {
                Analytics.trackEvent('Results Page', 'Clicked', 'One Day Breakdown');
                TpcOneDayGraphConfig.oneDayChartConfig.graphData.splice(0);
                TpcOneDayGraphService.gotoOneDayChartView(event.point.category);
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
        tickInterval: 1 * 24 * 3600 * 1000,
        minTickInterval:1 * 24 * 3600 * 1000,
        minRange: 1 * 24 * 3600 * 1000,
        startOnTick: true,
        min: startDate,
        max: endDate,
        labels: {
          enabled: true,
          rotation:0,
          step: 1,
          formatter: function () {
            return '<a ng-click="vmg.xLabelClick(\''+ Highcharts.dateFormat('%e%b%y',this.value) +'\')" ga-track-event="[\'Results Page\', \'Clicked\', \'One Day Breakdown by Date\']">' + Highcharts.dateFormat('%e%b%y',this.value)  + '</a>';
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
              this.options.startOnTick = false;
            }else{
              this.options.labels.rotation= -45;
              this.options.tickInterval =  1 * 24 * 3600 * 1000;
              this.options.startOnTick = true;
            }
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        min: gMin - 10,
        max: gMax + 10,
        labels: {
          enabled: true
        }
      },
      credits: {
        enabled: false
      },
      tooltip: {

        borderRadius	: 2,
        borderWidth		: 1,
        borderColor		: '#999',
        shadow			: false,
        shared			: true,
        useHTML			: true,
        yDecimals		: 0,
        valueDecimals	: 0,
        formatter: function() {
          var dateValue = Highcharts.dateFormat('%d%b%y', this.x).toUpperCase();
          var points='<table class="tip"><caption>Date '+dateValue+'</caption>'
            +'<tbody>';
          $.each(this.points,function(i,point){
            var mkt =point.series.options.market.split(',');
            points+='<tr><th style="color: '+point.series.color+'">'+mkt[0]+' ' + mkt[2]+': </th>'
              + '<td style="text-align: right"><b>'+SummaryFilters.amounts[0].name+'</b>:'+Highcharts.numberFormat(this.y, 0,"","")
              + ' ' + mkt[1] +'</td></tr>'
          });
          +'</tbody></table>';
          return points;
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
    var summaryChartConfig = {
      options:summaryGraphOption,
      series: [],
      title: {
        text : '',
        style: {
          fontWeight: 'normal',
          fontSize:'15px',
          color: Highcharts.getOptions().colors[1],
          fill: Highcharts.getOptions().colors[1]
        }
      },
      loading: false
    }

    var service = {
      summaryChartConfig:summaryChartConfig
    };

    return service;
  }
})();
