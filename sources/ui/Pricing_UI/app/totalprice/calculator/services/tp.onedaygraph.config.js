'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcOneDayGraphConfig', TpcOneDayGraphConfig);

   function TpcOneDayGraphConfig () {

    var oneDayGraphOption = {
      chart: {
        type: 'scatter', zoomType: 'y',
        resetZoomButton: {
          position: {
            // align: 'right', // by default
            // verticalAlign: 'top', // by default
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
      xAxis: {
        categories: [],
        startOnTick:   true,
        endOnTick:     true,
        showLastLabel: true,
        showEmpty:     false,
        legend:      { y: 120, floating: true, backgroundColor: '#FFFFFF' }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        },
        labels: {
          enabled: true
        }
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 1
      },
      tooltip: {
        stickyTracking:false,
        formatter: function () {
          return '<b>Amount: </b>'+Highcharts.numberFormat(this.y,0,'','') +'<b> FareClass: </b>'+this.point.fc;
        }
        //  borderRadius	: 2,
        //  borderWidth		: 1,
        //  borderColor		: '#999',
        //  shadow			: false,
        //  shared			: true,
        //  useHTML			: true,
        //  yDecimals		: 0,
        //  valueDecimals	: 0,
        //  formatter: function() {
        //    var points='<table class="tip"><caption>Market '+this.series.name+'</caption>'
        //      +'<tbody>';
        //    $.each(this.series.options.data,function(i,point){
        //      points+='<tr><td style="text-align: left">FareClass: '+point.fc+'</td>'
        //      + '<td style="text-align: right">Amount: '+Highcharts.numberFormat(point.y, 0,"","")
        //      '</td></tr>'
        //    });
        //    +'</tbody></table>';
        //    return points;
        //  }

      },
      credits: {
        enabled: false
      },
      plotOptions: {
        scatter: {
          dataLabels: {
            enabled: true,
            allowOverlap:true,
            formatter: function () {
              return '';//Highcharts.numberFormat(this.y,0,'','') + ' ' + this.point.fc;
            }
          },

          marker: { radius: 5, states: { hover: { enabled: true, lineColor: 'rgb(100,100,100)' } } },
          states: { hover: { marker: { enabled: false } } }

        }
      }
    };

    var oneDayChartConfig = {
      options: oneDayGraphOption,
      series:[],
      loading: false,
      graphData:[],
      title: {
        text: '',
        align: 'center',
        style: {
          color: Highcharts.getOptions().colors[1],
          fontWeight: 'bold'
        }
      },
      showOneDayGraph:false,
      size: {
        width: 950,
        height: 480
      }
    };

    var service = {
      oneDayChartConfig:oneDayChartConfig
    };

    return service;
  }
})();
