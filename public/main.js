const drawChart = () => {

  fetch('/merged/performance.json')
    .then(response => response.json())
    .then(data => {

      const series = Object.keys(data.desktop).map(url => {
        return {
          name: url,
          data: data.desktop[url]
        }
      })

      $('#container').highcharts({
        chart: {
          type: 'spline',
          height: 800,
          zoomType: 'x'
        },
        title: {
          text: 'Page performance trend',
        },
        yAxis: [{
          title: {
            text: 'Page Score',
          },
          plotLines: [{
            color: '#a4c08e',
            width: 10,
            value: 70,
          }],
          plotBands: [{ // mark the weekend
            color: '#FCFFC5',
            from: 100,
            to: 200,
          }],
        }, {
          opposite: true,
          linkedTo: 0,
          title: {
            text: 'Page Scores',
          },
        }],
        xAxis: {
          labels: {
            rotation: -45,
          },
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
          },
          title: {
            text: 'Date',
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x:%e. %b %H:%M}: {point.y:.2f}'
        },
        plotOptions: {
          series: {
            marker: {
              enabled: true
            },
            label: {
              connectorAllowed: false
            },
            dataLabels: {
              enabled: true,
            },
            events: {
              legendItemClick: function (e) {
                // Upon cntrl-click of a legend item, rather than toggling visibility, we want to hide all other items.
                var hideAllOthers = e.browserEvent.ctrlKey;
                if (hideAllOthers) {
                  var seriesIndex = this.index;
                  var series = this.chart.series;

                  for (var i = 0; i < series.length; i++) {
                    // rather than calling 'show()' and 'hide()' on the series', we use setVisible and then
                    // call chart.redraw --- this is significantly faster since it involves fewer chart redraws
                    if (series[i].index === seriesIndex) {
                      if (!series[i].visible) series[i].setVisible(true, false);
                    } else {
                      if (series[i].visible) series[i].setVisible(false, false);
                    }
                  }
                  this.chart.redraw();
                  return false;
                }
              }
            },
          }
        },
        series: series
      });
    });
}

drawChart()
