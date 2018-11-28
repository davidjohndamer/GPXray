//var map = L.map('map');
//L.tileLayer('https://www.openstreetmap.org/#map=15/55.8778/-4.2390', {
//  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
//}).addTo(map);

var gpx = 'Lugano.gpx'; // URL to your GPX file or the GPX itself

var gpxFile = new L.GPX(gpx, {});

console.log(gpxFile.get_elevation_data());

var elevations = [];

// extract the actual elevation numbers
gpxFile.get_elevation_data().forEach(function(element) {
    elevations.push(element[1]);
  });

var data = {
    // A labels array that can contain any sort of values
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
        elevations
    ]
  };
  
  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  new Chartist.Line('.ct-chart', data);