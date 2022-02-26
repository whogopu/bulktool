const median = (values) => {
  if (values.length === 0) throw new Error("No inputs");

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

const compare = (a, b) => {
  if (a[0] < b[0]) {
    return -1;
  }
  if (a[0] > b[0]) {
    return 1;
  }
  return 0;
}

getMedianPerDay = (arr = [], days = 0) => {
  let data = []
  let dateMap = {}

  arr.sort(compare);

  if (days < 1) return arr;

  arr.forEach(a => {
    let dateInString = moment(a[0]).format("YYYY-MM-DD");
    var date = moment(dateInString).tz('Asia/Kolkata').format()
    let timestamp = moment(date).format("x");
    if (!dateMap.hasOwnProperty(timestamp)) dateMap[timestamp] = []
    dateMap[timestamp].push(a)
  })

  let dateMapCopy = JSON.parse(JSON.stringify(dateMap));

  const getXDaysData = (days, currDate, dateMap, next = false) => {
    let daysdata = [];
    if (next) {
      for (let i = 1; i <= days; i++) {
        let daysMili = i * 24 * 60 * 60 * 1000
        daysdata = daysdata.concat(dateMap[currDate + daysMili] || [])
      }
    } else {
      for (let i = days; i >= 1; i--) {
        let daysMili = i * 24 * 60 * 60 * 1000
        daysdata = daysdata.concat(dateMap[currDate - daysMili] || [])
      }
    }
    return daysdata;
  }
  Object.keys(dateMap).forEach(currDate => {
    currDate = parseInt(currDate)
    let lastXDaysData = getXDaysData(days, currDate, dateMap)
    let nextXDaysData = getXDaysData(days, currDate, dateMap, true)
    dateMapCopy[currDate] = [].concat(lastXDaysData).concat(dateMap[currDate]).concat(nextXDaysData)
  })

  Object.keys(dateMapCopy).forEach(d => {
    let arr = dateMapCopy[d];
    let dateMedian = median(arr.map(a => a[0]));
    let scoreMedian = median(arr.map(a => a[1]));
    data.push([dateMedian, scoreMedian])
  })

  return data;
}

let smallUrlsSet = [
  "https://www.99acres.com/property-in-noida-ffid?test=mytest",
  "https://www.99acres.com/property-in-sector-150-noida-ffid?test=mytest",
  "https://www.99acres.com/property-for-rent-in-noida-ffid?test=mytest",
  "https://www.99acres.com/property-for-rent-in-sector-150-noida-ffid?test=mytest",
  "https://www.99acres.com/rent-paying-guest-pg-in-noida-ffid?test=mytest",
  "https://www.99acres.com/rent-paying-guest-pg-in-sector-150-noida-ffid?test=mytest",
  "https://www.99acres.com/commercial-property-in-noida-ffid?test=mytest",
  "https://www.99acres.com/commercial-property-in-sector-150-noida-ffid?test=mytest",
  "https://www.99acres.com/commercial-property-for-rent-in-noida-ffid?test=mytest",
  "https://www.99acres.com/commercial-property-for-rent-in-sector-150-noida-ffid?test=mytest",
  "https://www.99acres.com/rent-coworking-space-in-india-ffid?test=mytest"
]

const drawPlatformPerformanceChart = (id, label, series) => {
  $(id).highcharts({
    time: {
      timezoneOffset: -330
    },
    chart: {
      type: 'spline',
      height: 800,
      zoomType: 'x'
    },
    title: {
      text: label + ' Page performance trend',
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
        year: '%b',
        // minTickInterval: 24 * 3600 * 1000,
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
}

const drawChart = () => {

  fetch('/merged/performance.json')
    .then(response => response.json())
    .then(data => {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

      let days = params.days;
      let urls = params.urls || 'default';

      const desktopSeries = []
      Object.keys(data.desktop).forEach(url => {
        if (!(url.includes('module=test') || url.includes('module=dev'))) {
          if (urls === 'default' || (urls === 'small' && smallUrlsSet.includes(url))) {
            desktopSeries.push({
              name: url,
              data: getMedianPerDay(data.desktop[url], days),
            })
          }
        }
      })

      const mobileSeries = []
      Object.keys(data.mobile).forEach(url => {
        if (!(url.includes('module=test') || url.includes('module=dev'))) {
          if (urls === 'default' || (urls === 'small' && smallUrlsSet.includes(url))) {
            mobileSeries.push({
              name: url,
              data: getMedianPerDay(data.mobile[url], days),
            })
          }
        }
      })

      drawPlatformPerformanceChart("#desktopContainer", "Desktop", desktopSeries)
      drawPlatformPerformanceChart("#mobileContainer", "Mobile", mobileSeries)

    });
}

drawChart()
