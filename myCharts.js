function loadGraphs(gpxData){
  
  // Elevation Line Chart
  
  // start constructing chart data
  var elevations = [];
  var times = [];

  // extract the actual elevation numbers
  gpxData.get_elevation_data().forEach(function(element) {
      elevations.push(element[1]);
    });

  for(let count=0 ; count<elevations.length;count++){
    times.push((count*15)/60);
  }

  elevationOverTime = []
  for(let count=0 ; count<elevations.length;count++){
    elevationOverTime.push( {x:times[count], y:elevations[count]} );
  }

  // get time of run in decimal mins 
  var endTime = times.slice(-1)[0];

  var data = {
      // Our series array that contains series objects or in this case series data arrays
      series: [
          elevationOverTime
      ]
    };

    var options = {
      
        chartPadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        axisX:{
          type: Chartist.FixedScaleAxis,
          // display minutes in 8 fixed segments
          ticks: [0, Math.round(endTime*0.125), Math.round(endTime*0.25), Math.round(endTime*0.375), Math.round(endTime*0.5), Math.round(endTime*0.625), Math.round(endTime*0.75), Math.round(endTime*0.875), Math.round(endTime)],
          low: 0
        },
          axisY: {
          onlyInteger: true
        },
        showArea: true,
        plugins: [
          Chartist.plugins.ctAxisTitle({
            axisX: {
              axisTitle: "Time (mins)",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: 50
              },
              textAnchor: "middle"
            },
            axisY: {
              axisTitle: "Elevation (m)",
              axisClass: "ct-axis-title",
              offset: {
                x: 0,
                y: -1
              },
              flipTitle: false
            }
          }),
          Chartist.plugins.ctAccessibility({
            caption: 'A graphical chart showing elevation over time for this exercise',
            seriesHeader: 'elevation in metres recorded every 15 seconds or quarter of a minute',
            summary: 'Elevation is metres above sea level, time is in minutes from start of activity',
            valueTransform: function(value) {
              return value + 'metres';
            }
          })
        ]
      
    };
    
  // Create the line chart object 
  elevationChart = new Chartist.Line('.ct-line-chart', data, options);


  // Heartbeat Donut Chart
  var hbBucket1 = 0; // less than 60
  var hbBucket2 = 0; // 50 - 100
  var hbBucket3 = 0; // 100 - 125
  var hbBucket4 = 0; // 125 - 150
  var hbBucket5 = 0; // 150 - 175
  var hbBucket6 = 0;  // 175+
    
  // extract the actual heartbeat numbers and populate buckets
  gpxData.get_heartrate_data().forEach(function(element) {
    if(element[1] < 60){
      hbBucket1++;
    } else if (element[1] < 100) {
      hbBucket2++;
    }else if (element[1] < 125) {
      hbBucket3++;
    }else if (element[1] < 150) {
      hbBucket4++;
    }else if (element[1] < 175) {
      hbBucket5++;
    }else {
      hbBucket6++;
    }
  });
    
  var numHeartbeats = gpxData.get_heartrate_data().length;
    
  heartChart = new Chartist.Pie('.ct-pie-chart', {
      // we want the heartbeat data as percentages
      series: [(hbBucket1/numHeartbeats)*100,(hbBucket2/numHeartbeats)*100,(hbBucket3/numHeartbeats)*100,(hbBucket4/numHeartbeats)*100,(hbBucket5/numHeartbeats)*100,(hbBucket6/numHeartbeats)*100,],
      labels: ['<60', '60-100', '100-125', '125-150', '150-175', '>175']
    }, {
      donut: true,
      donutWidth: 60,
      startAngle: 270,
      total: 200,
      showLabel: true,
        plugins: [
            Chartist.plugins.fillDonut({
                items: [{
                    content: '<i class="fas fa-heartbeat fa-7x" style="color:red"></i>',
                    offsetY:-60,
                }]
            }),
            Chartist.plugins.ctAccessibility({
              caption: 'A graphical chart showing percentage time spent at different heartbeat levels',
              summary: '6 preset heartbeat levels were chosen. In order: less than 60, 60 to 100, 100 to 125, 125 to 150, 150 to 175 and 175 plus.',
              valueTransform: function(value) {
                return value + '%';
              }
            })
        ]
    });

    
}

function activatetab(tab) {
  var thetabs = document.getElementsByClassName('tab');
  [].forEach.call(thetabs, function(thetab) {
    thetab.classList.remove('active');
  });
  document.getElementById('tab' + tab).classList.add('active');
  
  var thetabcontents = document.getElementsByClassName('tabcontent');
  [].forEach.call(thetabcontents, function(thetabcontent) {
    thetabcontent.classList.remove('active');
  });
  document.getElementById('tabcontent' + tab).classList.add('active');

  // fixes rendering bug!
  heartChart.update();
  elevationChart.update();

  }

