//var map = L.map('map');
//L.tileLayer('https://www.openstreetmap.org/#map=15/55.8778/-4.2390', {
//  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
//}).addTo(map);

//var gpx = 'A.gpx'; // URL to your GPX file or the GPX itself

//var gpxFile = new L.GPX(gpx, {});
function loadGraphs(gpxData){
  console.log(gpxData.get_elevation_data());

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
  console.log(endTime);

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
          ticks: [0, Math.round(endTime*0.125), Math.round(endTime*0.25), Math.round(endTime*0.375), Math.round(endTime*0.5), Math.round(endTime*0.625), Math.round(endTime*0.75), Math.round(endTime*0.875), Math.round(endTime)],
          low: 0
        },
          axisY: {
          onlyInteger: true
        },
        //low: 0,
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
          })
        ]
      
    };
    
    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('.ct-line-chart', data, options);


    console.log(gpxData.get_heartrate_data());

  var hbBucket1 = 0; // less than 60
  var hbBucket2 = 0; // 50 - 100
  var hbBucket3 = 0; // 100 - 125
  var hbBucket4 = 0; // 125 - 150
  var hbBucket5 = 0; // 150 - 175
  var hbBucket6 = 0;  // 175+
    
  // extract the actual heartbeat numbers
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
    
    new Chartist.Pie('.ct-pie-chart', {
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
            })
        ]
    });

    
  }


  function activatetab(tab) {
  
    resizeMap(); $(window).resize(resizeMap);

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
    

    $(window).resize();
  }
