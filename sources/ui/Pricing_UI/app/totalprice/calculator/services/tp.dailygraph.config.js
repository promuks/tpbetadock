'use strict';
(function() {
  angular.module('app.totalprice.calculator').factory('TpcDailyGraphConfig', TpcDailyGraphConfig);

  TpcDailyGraphConfig.$inject = ['$timeout'];

   function TpcDailyGraphConfig ($timeout) {

    var dailyGraphOption = {
      chart: {
        type: 'column',
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
      title: {
        text: '',
        align: 'center',
        style: {
          color: Highcharts.getOptions().colors[1],
          fontWeight: 'bold'
        }
      },
      xAxis: {
        categories: []
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        },
        stackLabels: {
          enabled: true,
          rotation: -5,
          formatter: function () {
            return '';//Highcharts.numberFormat(this.total, 0,'','');
          },
          style: {
            fontWeight: 'bold',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
          }
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
        formatter: function () {
         // var mkt = this.point.series.options.mkt.split(' ');
          var mkt = this.point.series.options.mkt[this.key].split(' ');
          var totalAmt = Highcharts.numberFormat(this.total, 0,'','');
          if(!totalAmt || totalAmt === '0'){
            totalAmt =  this.point.series.options.total[this.key];
          }
          return '<b>Date: </b>' + mkt[2] + '<br/> <b>Market: </b>' + mkt[0]+' <b>Fare Class: </b>' + mkt[1]+ '<br/>' +
            '<b>' + this.series.name + ': </b>' + this.y + '<b> Total Amt: </b>'+ totalAmt+'<br/>';
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
         stacking: 'normal',
          pointPadding: 0.1,
          groupPadding: 0,
          borderWidth: 1,
          shadow: false,
          dataLabels: {
            enabled: true,
            rotation: 0,
            formatter:function(){
                return Highcharts.numberFormat(this.y, 0,'','');
            },
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray'
          }
        },
        series: {
          dataLabels: {
            crop: false,
            allowOverlap: true // ADDED
          }
        }
      }
    };

    var dailysChartConfig = {
      options: dailyGraphOption,
      series:[],
      loading: false,
      graphData:[],
      showDailyGraph:false,
      size: {
        width: 950,
        height: 280
      },
      seriesName:'',
      currDate:''
    };

    var service = {
      dailysChartConfig:dailysChartConfig
    };

    return service;
  }
})();
