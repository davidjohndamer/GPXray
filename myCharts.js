//var map = L.map('map');
//L.tileLayer('https://www.openstreetmap.org/#map=15/55.8778/-4.2390', {
//  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
//}).addTo(map);

var gpx = 'Lugano.gpx'; // URL to your GPX file or the GPX itself

var gpxFile = new L.GPX(gpx, {});

console.log(gpxFile.get_elevation_data());

var elevations = [];
var times = [];

// extract the actual elevation numbers
gpxFile.get_elevation_data().forEach(function(element) {
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
endTime = times.slice(-1)[0];
console.log(endTime);

var data = {
    // A labels array that can contain any sort of values
    // get_start_time()
    // create array of times that is length of elevations by adding 15s each time (default interval tolerance)


    //label: times2,
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
  new Chartist.Line('.ct-chart', data, options);