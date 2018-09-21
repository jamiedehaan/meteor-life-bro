
var map;
// this function initially renders the map, this and the map var MUST be global
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 39.7392,
      lng: -104.9903
    },
    zoom: 3
  });
};

//Empty, to be set as an object on clicking a marker
var tempStore;
//If tempStore exists in local storage, get it. Because it is stored as a string, 
//we have to parse the stored data back into an object. If it does not exist in
//local storage, then set tempStore to null.
if (localStorage.getItem("tempStore")) {
  tempStore = JSON.parse(localStorage.getItem("tempStore"))
} else {
  tempStore = null;
}
//This function is called on clicking a marker. Here we give temp store its value,
//and then stringify it for local storage. It is targeted to the particular object
//in the database referred to by the marker in the on click.
function addMarkerToLocalStorage({ name, mass, fall, type }) {
  tempStore = { name, mass, fall, type };
  localStorage.setItem("tempStore", JSON.stringify(tempStore));
};

// this function is responsible for doing the AJAX call to NASA/SODA
function addMarkers() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // the callback in the forEach runs once for each
    // meteorite that comes back from the AJAX response
    response.forEach(function (meteorite) {

      //This is the custom icon, it is a variable with an image url, if your image is
      //big, then use scaledSize to set it (x,y). I dont know exactly what the other two 
      //properties or for.
      var icon = {
        url: "assets/maps-icon/meteorT.png", // url
        scaledSize: new google.maps.Size(32, 32), // size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor 
      };

      //Here we build an object to hold and re-format lat and lng to be what Google expects
      var coordinates = {
        lat: Number(meteorite.reclat),
        lng: Number(meteorite.reclong)
      }

      // then create a new marker and add it to the map, filling the position with our re-
      //formatted coordinates, naming each from the DB object, and setting the icon to our 
      //custom icon. "map: map;" puts the icon on the map.
      var marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        title: meteorite.name,
        icon: icon
      });

      //Infowindow exists, and it is blank
      infowindow = new google.maps.InfoWindow({
        content: ""
      });

      //On hover populate pop div with meteorite object info.
      google.maps.event.addListener(marker, "mouseover", function () {
        $("#pop-info").html("<p>Name: " + meteorite.name + "</p><p>Mass: " + meteorite.mass + "</p><p>Status: " + meteorite.fall + "</p><p>Type: " + meteorite.recclass);
      });

      //When no longer hovering, clear window.
      google.maps.event.addListener(marker, "mouseout", function () {
        $("#pop-info").text("")
      });

      //On click, set infowindow to meteorite name and open it on map. Then run storage function, 
      //and populate static info window.
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

//Variables used in AJAX call and infowindows.
var mass;
var limit;
var status;
var type;
var queryURL;

//Sets global variables to form inputs, and runs addMarkers function.
$("#strike").on("click", function (event) {
  event.preventDefault();

  mass = $("#minMass").val().trim();
  limit = $("#numResults").val().trim();
  status = $("#status").val().trim();
  queryURL = "https://data.nasa.gov/resource/y77d-th95.json?fall=" + status + "&$where=mass>" + mass + "&$limit=" + limit;
  addMarkers();
})
