var mymap = L.map('mapid').setView([46.003257147967815399169921875, 8.95168307237327098846435546875], 13);
//var marker = L.circle([55.864, -4.251], { radius: 50}).addTo(mymap).bindPopup("Centre of Glasgow").openPopup;





L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
   accessToken: 'pk.eyJ1IjoiMjI2Njk4MGQiLCJhIjoiY2puNjNsYmtlMDB1NTNxcW13bXZ1NWFsaiJ9.XFlV393S5b13Bd5jd1AgnA'
}).addTo(mymap);

//L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
//}).addTo(mymap);

var gpx = './Lugano.gpx'; // URL to your GPX file or the GPX itself
new L.GPX(gpx, {async: true}).on('loaded', function(e) {
  mymap.fitBounds(e.target.getBounds());
}).addTo(mymap);

//function onMapClick(e) {
  //  alert("You clicked the map at " + e.latlng);
//}

//mymap.on('click', onMapClick);
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);





