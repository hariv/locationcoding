var origin, map, success = false, fileName = "File 1", accuracy = 0.99;

window.onload = function() {
  if(success == false)
    document.getElementById("tcrStatus").innerHTML = "Processing of " + fileName + " failed. Please enter the location below.";
  else {
    document.getElementById("tcrStatus").innerHTML = "Processing of " + fileName + " succeeded, with accuracy " + accuracy +". View or modify the location below."
    initMap("Kemper Hall UC Davis");
    document.getElementsByClassName("location")[0].value = "Kemper Hall UC Davis";
    addMarker("Kemper Hall UC Davis");
  }

}

function initMap(location) {
  if(!location)
    location = "Academic Surge UC Davis"
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({"address": location}, function(result) {
    origin = {lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng()};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: origin
    });    
  });
}

function addMarker(location) {
  var locationGeocoder = new google.maps.Geocoder(), position, marker;
  locationGeocoder.geocode({"address": location}, function(result) {
    position = {lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng()};
    marker = new google.maps.Marker({
      position: position,
      label: {
        text: location,
        color: '#A9A9A9'
      },
      map: map
    });
  });
}

function visualize() {
  var location = document.getElementsByClassName("location")[0].value;
  document.getElementById("updateButton").style.display = "block";
  document.getElementById("tcrStatus").innerHTML = location + " marked on the map.";
  initMap(location);
  addMarker(location);
}