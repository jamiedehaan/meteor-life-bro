


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

}


// $(document).ready(function(){
//   $('select').formSelect();
// });

// this function is responsible for doing the AJAX call to NASA
// and putting the markers on the map
function addMarkers() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log("response", response);

    console.log("URL" + queryURL);
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
        $("#pop-info").html("<p>" + meteorite.name + "</p><p>" + meteorite.mass + "</p><p>" + meteorite.fall + "</p>");
        // var x = document.getElementById("pop-info");
        // if (x.style.display === "none") {
        //   x.style.display = "block";
        // } else {
        //   x.style.display = "none";
        // }
      });
      google.maps.event.addListener(marker, "mouseout", function () {
        $("#pop-info").text("")
        // var x = document.getElementById("pop-info");
        // if (x.style.display === "block") {
        //   x.style.display = "none";
        // } else {
        //   x.style.display = "none";
        // }
      });
      google.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(meteorite.name);
        infowindow.open(map, this);
      });
      google.maps.event.addListener(marker, "click", function () {
        $("#info-box").html("<p>Name: " + meteorite.name + "</p><p>Mass: " + meteorite.mass + "</p><p>Status: " + meteorite.fall + "</p><p>Type: " +meteorite.recclass);
      });
    })
  })
    .catch(err => console.log(err));
}
var mass;
var limit;
var status;
var queryURL;

$("#strike").on("click", function (event) {
  event.preventDefault();

  mass = $("#minMass").val().trim();
  limit = $("#numResults").val().trim();
  status = $("#status").val().trim();
  queryURL = "https://data.nasa.gov/resource/y77d-th95.json?fall=" + status + "&$where=mass>" + mass + "&$limit=" + limit;
  addMarkers();
})
