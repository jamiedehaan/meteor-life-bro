# project-one
Group project of Tyler, Jacob, Stephen, and Jamie


Super excellent meteor strike mapping and navigate-to application.

Minimum Viability = Successful mapping of strikes on googlemap that has nav functionality. Filter for showing strikes based on found/landed.


_ What do we need from NASA API? _
- Need the coordinates of the strikes = GeoLocation
- how do we pull strike data?

_ What do we need from GMAPS API?
- The map itself, and routing.
- How do interact with the map?
- How do we interact with routing?
- How do we feed it coordinates?

_ How do we mesh the two? _
- Find a way to input NASA coords on to the GMAP


_ How do we display the results? _
- We need to show the map, start location, and destination
- do we use a special icon on the map display to mark strikes?/How do we?

/////////////////////////////////////////////////////////////////////////////////////////////

var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
var mapOptions = {
  zoom: 4,
  center: myLatlng
}
var map = new google.maps.Map(document.getElementById("map"), mapOptions);

var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
});

// To add the marker to the map, call setMap();
marker.setMap(map)


function initMap() {
  var myLatLng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}

https://data.nasa.gov/resource/y77d-th95.json?fall=Fell&$where=mass>100&$limit=1000&year='2014-10-13T00:00:00.000'