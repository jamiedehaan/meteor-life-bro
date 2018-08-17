


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

// this function is responsible for doing the AJAX call to NASA
// and putting the markers on the map
function addMarkers() {
  $.ajax({
      url: "https://data.nasa.gov/resource/y77d-th95.json?fall=Fell&$where=mass>20&$limit=100",
      method: "GET"
  }).then(function(response) {
      console.log("response", response);

      // the callback in the forEach runs once for each
      // meteorite that comes back from the AJAX response
      response.forEach(function(meteorite) {
          // build an object to hold/format lat and lng like Google expects
          var coordinates = {
              lat: Number(meteorite.reclat),
              lng: Number(meteorite.reclong)
          }

          // then create a new marker and add it to the map
          var marker = new google.maps.Marker({
              position: coordinates,
              map: map,
             title: meteorite.name
             
         });
         infowindow = new google.maps.InfoWindow({
             content: ""
           });
         google.maps.event.addListener(marker, "mouseover", function() {
             $("#otherinfo").html("<p>" + meteorite.name + "</p><p>" + meteorite.mass + "</p><p>" + meteorite.fall + "</p>");
           });
           google.maps.event.addListener(marker, "mouseout", function() {
             $("#otherinfo").text("")
           });
           google.maps.event.addListener(marker, "click", function() {
             infowindow.setContent(meteorite.name);
             infowindow.open(map, this);
           });  
      })
})
    .catch(err => console.log(err));
}
addMarkers();
$("#submit").on("click", function () {
  var mass = $("#minMass").val().trim();
  var limit = $("#numResults").val().trim();
  var queryURL = "https://data.nasa.gov/resource/y77d-th95.json?fall=Fell&$where=mass>" + mass + "&$limit=" + limit;
  
  addMarkers();
})
