'use strict';

angular.module('cryptichain')
  .directive('stockChart', function ($timeout) {
      function StockChart (scope, elm, attr) {
          var self = this;

          this.style = {
              width: '100%',
              height: '500px'
          };

          this.config = {
              type: 'stock',
              theme: 'light',
              pathToImages: '/img/amcharts/',
              dataSets: [{
                  fieldMappings: [{
                      fromField: 'date',
                      toField: 'date'
                  }, {
                      fromField: 'open',
                      toField: 'open'
                  }, {
                      fromField: 'close',
                      toField: 'close'
                  }, {
                      fromField: 'high',
                      toField: 'high'
                  }, {
                      fromField: 'low',
                      toField: 'low'
                  }, {
                      fromField: 'btcVolume',
                      toField: 'btcVolume'
                  }, {
                      fromField: 'xcrVolume',
                      toField: 'xcrVolume'
                  }, {
                      fromField: 'numTrades',
                      toField: 'numTrades'
                  }],
                  color: '#888888',
                  dataProvider: [],
                  categoryField: 'date'
              }],
              panels: [{
                  title: 'Price',
                  showCategoryAxis: false,
                  percentHeight: 70,
                  valueAxes: [{
                      id: 'v1',
                      dashLength: 5,
                      precision: 8
                  }],
                  categoryAxis: {
                      dashLength: 5,
                      parseDates: true
                  },
                  stockGraphs: [{
                      type: 'candlestick',
                      id: 'g1',
                      openField: 'open',
                      closeField: 'close',
                      highField: 'high',
                      lowField: 'low',
                      valueField: 'close',
                      lineColor: '#288234',
                      fillColors: '#38B449',
                      negativeLineColor: '#990000',
                      negativeFillColors: '#CC0000',
                      fillAlphas: 1,
                      useDataSetColors: false,
                      comparable: false,
                      showBalloon: true,
                      balloonText: 'Open: <b>[[open]]</b><br>Close: <b>[[close]]</b><br>Low: <b>[[low]]</b><br>High: <b>[[high]]</b>',
                      balloonColor: '#888888',
                      proCandlesticks: true
                  }]
                },
                {
                    title: 'Volume',
                    percentHeight: 30,
                    marginTop: 1,
                    showCategoryAxis: true,
                    valueAxes: [ {
                        dashLength: 5,
                        precision: 8
                    } ],
                    categoryAxis: {
                        dashLength: 5,
                        parseDates: true
                    },
                    stockGraphs: [{
                        valueField: 'btcVolume',
                        type: 'column',
                        showBalloon: true,
                        balloonText: 'Volume: <b>[[value]]</b>',
                        balloonColor: '#888888',
                        fillAlphas: 1,
                        colors: 'black',
                        backgroundColors: 'black',
                        fillColors: 'black'
                    }]
                  }
              ],
              chartCursorSettings: {
                  fullWidth: true,
                  cursorAlpha: 0.1,
                  valueBalloonsEnabled: true,
                  valueLineBalloonEnabled: true,
                  valueLineEnabled: true,
                  valueLineAlpha: 0.5,
                  cursorColor: '#1E9ADD'
              },
              chartScrollbarSettings: {
                  graph: 'g1',
                  graphType: 'smoothedLine'
              },
              periodSelector: {
                  position: 'bottom',
                  periods: []
              }
          };

          this.dataSets = {
              minute: {
                  minPeriod: 'mm',
                  periods: [{
                      period: 'MAX',
                      label: 'MAX',
                      selected: true
                  }, {
                      period: 'hh',
                      count: 12,
                      label: '12 Hours'
                  }, {
                      period: 'hh',
                      count: 6,
                      label: '6 Hours'
                  }, {
                      period: 'hh',
                      count: 3,
                      label: '3 Hours'
                  }]
              },
              hour: {
                  minPeriod: 'hh',
                  periods: [{
                      period: 'MAX',
                      label: 'MAX',
                      selected: true
                  }, {
                      period: 'MM',
                      count: 1,
                      label: '1 Month'
                  }, {
                      period: 'WW',
                      count: 1,
                      label: '1 Week'
                  }, {
                      period: 'DD',
                      count: 1,
                      label: '1 Day'
                  }]
              },
              day: {
                  minPeriod: 'DD',
                  periods: [{
                      period: 'MAX',
                      label: 'MAX',
                      selected: true
                  }, {
                      period: 'MM',
                      count: 6,
                      label: '6 Months'
                  }, {
                      period: 'MM',
                      count: 3,
                      label: '3 Months'
                  }, {
                      period: 'MM',
                      count: 1,
                      label: '1 Month'
                  }]
              }
          };

          this.updatePeriod = function () {
              var newPeriod = (scope.newExchange || scope.newDuration);

              if (newPeriod) {
                  console.log('Updating period selector...');
                  scope.stockChart.categoryAxesSettings.minPeriod = self.dataSets[scope.duration].minPeriod;
                  scope.stockChart.periodSelector.periods = self.dataSets[scope.duration].periods;
                  scope.stockChart.validateNow();
              }

              return newPeriod;
          };

          this.updateCandles = function (newData, oldData) {
              var delay = 0;

              if (!newData) { return; }

              if (!scope.stockChart) {
                  delay = 500;
                  console.log('Initializing stock chart...');
                  scope.stockChart = AmCharts.makeChart('stockChart', self.config);
                  scope.stockChart.categoryAxesSettings = new AmCharts.CategoryAxesSettings();
              }

              $timeout(function () {
                  var newPeriod = self.updatePeriod(scope);

                  if (_.size(newData) > 0) {
                      console.log('Chart data updated');
                      scope.stockChart.dataSets[0].dataProvider = newData;
                      scope.stockChart.validateData();
                      elm.contents().css('visibility', 'visible');
                  } else {
                      console.log('Chart data is empty');
                      scope.stockChart.dataSets[0].dataProvider = [];
                      scope.stockChart.validateNow();
                      elm.contents().css('visibility', 'hidden');
                      elm.prepend('<p class="amChartsEmpty"><i class="fa fa-exclamation-circle"></i> No Data</p>');
                  }

                  if (newPeriod) {
                      scope.stockChart.periodSelector.setDefaultPeriod();
                      console.log('Default period set');
                  }

                  scope.newExchange = scope.newDuration = false;
              }, delay);
          };

          elm.css('width', self.style.width);
          elm.css('height', self.style.height);
      }

      return {
          restric: 'E',
          replace: true,
          template: '<div id="stockChart"></div>',
          link: function (scope, elm, attr) {
              var stockChart = new StockChart(scope, elm, attr);
              scope.$watch('candles', stockChart.updateCandles, false);
          }
      };
  });
