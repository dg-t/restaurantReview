// MAP

// Variables
var map, pos, markerUserPos, infoLocationError, service, userPos, request;
var lastWindow = null;
var markers = [];
var divRest = document.getElementById('showRestaurant');
var placeMarkers = [];

// Map function
var initMap = function() {

    // Set default position to Spain
    pos = { lat: 40.4637, lng: 3.7492 };
    // Create a map from the Map constructor
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 4
    });

    // Create infoWindow for geolocation error handling and user position
    infoLocationError = new google.maps.InfoWindow;
    infoCurrentPos = new google.maps.InfoWindow;
    // Create marker for user current position
    markerUserPos = new google.maps.Marker({
        map: map,
        icon: {
            url: 'http://earth.google.com/images/kml-icons/track-directional/track-0.png',
            scaledSize: new google.maps.Size(30, 30)
        }
    });

    // Get user geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                markerUserPos.setPosition(userPos);
                map.setCenter(userPos);
                map.setZoom(15);

                // Request places to display
                request = {
                    location: userPos,
                    radius: '1000',
                    types: ['restaurant']
                };

                // Initiate a place nearby search
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, callback);

                // Add eventListener to dispaly results depending on mouse click
                map.addListener('click', function(event) {
                    // Center map to click position, clear previous markers and list
                    map.setCenter(event.latLng)
                    clearMarkers(placeMarkers);
                    clearList();

                    // Make a new request when the event is triggered 
                    request = {
                        location: event.latLng,
                        radius: '1000',
                        types: ['restaurant']
                    };
                    // Initiate new nearby search
                    service.nearbySearch(request, callback);
                });

                // EventListener to show user infoWindow
                markerUserPos.addListener('click', function() {
                    // check if a window is open, and close it when opening another
                    if (lastWindow) lastWindow.close();
                    infoCurrentPos.open(map, markerUserPos);
                    infoCurrentPos.setContent('Your position');
                    lastWindow = infoCurrentPos;
                });
            },
            function() {
                handleLocationError(true, infoLocationError, map.getCenter());
            });
    } else {
        // If browser doesn't support geolocation
        handleLocationError(false, infoLocationError, map.getCenter());
    }
}

// Geolocation error handling
var handleLocationError = function(browserHasGeolocation, infoLocationError, pos) {
    infoLocationError.setPosition(pos);
    infoLocationError.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation');
    infoLocationError.open(map);
}