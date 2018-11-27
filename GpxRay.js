"use strict";


// Use tiles from MapQuest; http://developer.mapquest.com/web/products/open/map
var TILE_LAYER = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data � <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors',
});

/* Variables */
var maps, _metadata, coords, points;


function resizeMap() {
    $('#map').css('width', window.innerWidth  + 'px').css('height', window.innerHeight  + 'px');
}

/** initialize map */
function initMap() {
    resizeMap();
    maps = L.map('map');
    maps.addLayer(TILE_LAYER);

    // resize map when window is resized
    $(window).resize(resizeMap);
}


/**
 parse xml file
 */
function parseGPX(xmlDocument) {
    var xml = $(xmlDocument);

    // get metadata
    var metadata = xml.find('metadata');
    if (metadata.length == 0) {
        console.log('Metadata not found.');
        _metadata = {
            name: 'name',
            desc: ''
        };
    } else {
        _metadata = {
            name: metadata.children('name').text(),
            desc: metadata.children('desc').text()
        };

    }

    // process points
    var trackPoints = xml.find('trkseg').children('trkpt');
    if (trackPoints.length == 0) {
        alert('No points. Malformed GPX?');
        return false;
    }

    coords = [];
    points = [];
    trackPoints.each(function (i, el) {
        var point = $(el);

        var lat = parseFloat(point.attr('lat')),
            lon = parseFloat(point.attr('lon'));
        coords.push(new L.LatLng(lat, lon));
        points.push({
            lat: lat,
            lon: lon,
            elevation: parseFloat(point.children('ele').text()),
            time: new Date(point.children('time').text()),
            heartRate: parseFloat(point.children('extensions').text()),

        });
    });

    return true;
}



/** returns the distance from starting point to given point. */
function cumulativeDistance(index) {
    var dist = 0;
    for (var i = 0; i < index; i++) {
        dist += coords[i].distanceTo(coords[i + 1]);
    }
    return dist;
}

/** point description. */
function pointDescription(index) {
    var point = points[index];
    var elapsedTime = Math.round((point.time - points[0].time) / 60000);
    var timeFraction = (point.time - points[0].time) / (points[points.length - 1].time - points[0].time);
    var distFraction = cumulativeDistance(index) / cumulativeDistance(points.length - 1);
    var dist_miles = cumulativeDistance(index) / 1609.34;
    var averSpeed = dist_miles / (elapsedTime/60)
    var description =
        'Time: ' + '<span title="' + point.time.toISOString() + '">' + elapsedTime + ' min</span>' +
        ' (' + Math.round(timeFraction * 100) + '%)' +
        '<br />' + 'Elevation: ' + Math.round(point.elevation * 100) / 100 + ' m' + '<br />' +
        'Average Speed: ' + Math.round(averSpeed * 100) / 100 + ' Mph'+'<br />'
        +'Heart-Rate: ' + point.heartRate + ' Bpm' + '<br />'

         + 'Distance: ' + Math.round(cumulativeDistance(index)) + ' m' +
        ' (' + Math.round(distFraction * 100) + '%)';
    return description;
}

/** given point, returns the index of the closest point to it in coords. */
function findClosestPoint(target) {
    var minDistance = Infinity,
        minIndex = -1;
    coords.forEach(function (point, i) {
        var dist = target.distanceTo(point);
        if (dist < minDistance) {
            minDistance = dist;
            minIndex = i;
        }
    });

    return minIndex;
}

/** opens popup. */
function pointMarker(target) {
    var closestIndex = findClosestPoint(target);
    var description = pointDescription(closestIndex);
    L.popup().setLatLng(coords[closestIndex]).setContent(description).openOn(maps);
}

/** display metadata locations. */
function displayMetadata() {
    $('#name').text(_metadata.name);
    $('#name').attr('title', _metadata.desc);
}

/** draws the path on the map. */
function drawPath() {
    var path = L.polyline(coords).addTo(maps);
    maps.fitBounds(path.getBounds());
    path.on('click', function (e) {
        pointMarker(e.latlng);
    });
    L.control.scale().addTo(maps);
}

/** load files, parse the XML and display on map. */
function loadFiles(files) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        var data = this.result;
        var xml;
        try {
            xml = $.parseXML(data);
        } catch (e) {
            console.log(e);
            alert('Invalid XML. You should check if this is actually a GPX file.');
            return;
        }
        var success = parseGPX(xml);
        if (success) {
            $('#drop').remove();
            $('footer').remove();
            displayMetadata();
            initMap();
            drawPath();
        }
    }

    reader.readAsText(files[0]);
}

/* Listens for files dragged to the drop div. */
$('#drop').bind({
    dragover: function () {
        $(this).addClass('hover');
        return false;
    },
    dragleave: function () {
        $(this).removeClass('hover');
        return false;
    },
    dragend: function () {
        $(this).removeClass('hover');
        return false;
    },
    drop: function (e) {
        $(this).removeClass('hover');
        e.preventDefault();

        e = e.originalEvent;
        var files = e.dataTransfer.files;
        loadFiles(files);

        return false;
    }
});

/* Initiate loading when file input is used. */
$('#load').change(function (e) {
    loadFiles(this.files);
});

/* Use drop areas as file-input-trigger button. */
$('#drop').click(function () {
    $('#load').trigger('click');
});

/* Header link reloads page, but only after confirmation. */
$('header > h1').click(function (e) {
    if (points !== undefined) {
        return confirm('Reloading the page will clear the loaded file.' +
            '\nAre you sure you want to continue?');
    } else {
        return true;
    }
});

/* prevents error message. */
_init = true;

