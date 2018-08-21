
var map;
// this function initially renders the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.7392,
      lng: -104.9903
    },
    zoom: 3
  });
};
var favMarker;
if (localStorage.getItem("favMarker")) {
  favMarker = JSON.parse(localStorage.getItem("favMarker"))
} else {
  favMarker = null;
}
function addMarkerToLocalStorage({ name, mass, fall, type }) {
  favMarker = {name, mass, fall, type};
  // console.log(name, mass, fall)
  localStorage.setItem("favMarker", JSON.stringify(favMarker));
  // console.log(localStorage.getItem("favMarker"))
};

// this function is responsible for doing the AJAX call to NASA
// and putting the favMarker on the map
function addMarkers() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // the callback in the forEach runs once for each
    // meteorite that comes back from the AJAX response
    response.forEach(function (meteorite) {
      // build an object to hold/format lat and lng like Google expects
      // var iconBase = 'assets/maps-icon/';
      var icon = {
        url: "assets/maps-icon/meteorT.png", // url
        scaledSize: new google.maps.Size(32, 32), // sze
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor 
      };
      var coordinates = {
        lat: Number(meteorite.reclat),
        lng: Number(meteorite.reclong)
      }
      // then create a new marker and add it to the map
      var marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        title: meteorite.name,
        icon: icon
      });
      infowindow = new google.maps.InfoWindow({
        content: ""
      });
      google.maps.event.addListener(marker, "mouseover", function () {
        $("#pop-info").html("<p>Name: " + meteorite.name + "</p><p>Mass: " + meteorite.mass + "</p><p>Status: " + meteorite.fall + "</p><p>Type: " + meteorite.recclass);
      });
      google.maps.event.addListener(marker, "mouseout", function () {
        $("#pop-info").text("")
      });
      google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(meteorite.name);
        infowindow.open(map, this);
        addMarkerToLocalStorage(
          {
            name: meteorite.name,
            mass: meteorite.mass,
            fall: meteorite.fall,
            type: meteorite.recclass
          }
        )
        $("#info-box").html("<p>Name: " + meteorite.name + "</p><p>Mass: " + meteorite.mass + "</p><p>Status: " + meteorite.fall + "</p><p>Type: " + meteorite.recclass);
      });
      
     
    });
  })
}
//   .catch (err => console.log(err));
// }
var mass;
var limit;
var status;
var type;
var queryURL;

$("#strike").on("click", function (event) {
  event.preventDefault();
  
  mass = $("#minMass").val().trim();
  limit = $("#numResults").val().trim();
  status = $("#status").val().trim();
  queryURL = "https://data.nasa.gov/resource/y77d-th95.json?fall=" + status + "&$where=mass>" + mass + "&$limit=" + limit;
  addMarkers();
})
