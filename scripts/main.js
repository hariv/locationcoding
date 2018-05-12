var origin, map;

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

function upload() {
  var inputTag = document.getElementById("fileUpload"), files = [];
  if('files' in inputTag) {
    document.getElementById("statusDiv").style.display = "block";
    if(inputTag.files.length == 0) {
      var footer = document.getElementById("footer");
      document.getElementById("statusDiv").innerHTML = "Please upload one or more files.";
      footer.style.top = window.getComputedStyle(footer).getPropertyValue('top') + 50;
      return;
    }
    document.getElementById("statusDiv").innerHTML = "Processing "+inputTag.files.length+ " file(s)";
    var spinner = document.createElement("img");
    spinner.src = "./images/spinner.gif";
    spinner.height = "20";
    spinner.width = "20";
    document.getElementById("statusDiv").appendChild(spinner);
    document.getElementById("generalContent").innerHTML = "";
    //makeRequest("fileUpload", inputTag.files);
    setTimeout(function(){ loadSingleLocation({success: true, fileName: "1.pdf", accuracy: 0.99, location: "Kemper Hall UC Davis"});}, 1000);
  }
}

function loadSingleLocation(locationObject) {
  var generalContent = document.getElementById("generalContent");
  document.getElementById("map").style.display = "block";
  generalContent.innerHTML = '<div id="locationDiv"><input type="text" class="location form-control" placeholder="Enter location" /><br /><input type="button" id="locationButton" value="Visualize!" class="btn btn-default" onclick="visualize()" /></div><input type="button" id="updateButton" value="Update!" class="btn btn-default" onclick="update()" /></div>';
  if(locationObject.success == true) {
    document.getElementById("statusDiv").innerHTML = "Processing of " + locationObject.fileName + " succeeded, with accuracy " + locationObject.accuracy +". View or modify the location below."
    initMap(locationObject.location);
    document.getElementsByClassName("location")[0].value = locationObject.location;
    addMarker(locationObject.location);
  }
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
  document.getElementById("statusDiv").innerHTML = location + " marked on the map.";
  initMap(location);
  addMarker(location);
}