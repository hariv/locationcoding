var app = angular.module("caltrans", []);

app.controller("caltransController", function($scope) {

  $scope.locationFields = ['Location1', 'Location2', 'Location3'];

  $scope.getLocations = function() {
    return this.locationFields;
  }
    
  $scope.putPoints = function(locations) {
    var self = this;
    this.locationGeocoder = new google.maps.Geocoder();
    _.each(locations, function(location) {
      //this.locationGeocoder = new google.maps.Geocoder();
      self.locationGeocoder.geocode({"address": location}, function(result) {
        self.n
        self.marker = new google.maps.Marker({
          position: self.position,
          label: {
            text: location,
            color: 'white',
          },
          map: map
        });
      });
    });
  }v

  $scope.visualize = function() {
    var self = this;
    this.locationFields = document.getElementsByClassName("location");
    this.locations = [];
    _.each(this.locationFields, function(locationField) {
      self.locations.push(locationField.value);
    });
    this.putPoints(this.locations);
  }
});

var origin, map;

function initMap() {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({"address": "Academic Surge UC Davis"}, function(result) {
    origin = {lat: result[0].geometry.location.lat(), lng: result[0].geometry.location.lng()};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: origin
    });    
  });
}