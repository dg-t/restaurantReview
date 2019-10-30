// MAP

// Variables
var map, marker, infoWindow;

// Map function
function initMap() {

    // Create a map from the Map constructor
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            // Spain
            lat: 40.4637,
            lng: 3.7492
        },
        zoom: 4
    });

    // Create marker
    marker = new google.maps.Marker({
        map: map,
    });

    // Create infoWindow
    infoWindow = new google.maps.InfoWindow;

    // Get user geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            marker.setPosition(pos);
            map.setCenter(pos);
            map.setZoom(15)
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // If browser doesn't support geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

// Geolocation error function
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation');
    infoWindow.open(map);
}