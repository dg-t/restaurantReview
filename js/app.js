// MAP

// Variables
var map, pos, markerUserPos, infoLocationError, service, userPos, request;
var lastWindow = null;
var markers = [];
var divRest = document.getElementById('showRestaurant');
var sorting = document.getElementById('sort');
var placeMarkers = [];

// Map function
var initMap = function() {

    // Create a map from the Map constructor
    map = new google.maps.Map(document.getElementById('map'));

    // Create infoWindow for geolocation error handling
    infoLocationError = new google.maps.InfoWindow;

    // Get user geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Set map center and zoom based on user position
                map.setCenter(userPos);
                map.setZoom(15);

                // Create infoWindow for user position
                infoCurrentPos = new google.maps.InfoWindow;

                // Create marker for user current position
                markerUserPos = new google.maps.Marker({
                    map: map,
                    icon: {
                        url: 'http://earth.google.com/images/kml-icons/track-directional/track-0.png',
                        scaledSize: new google.maps.Size(30, 30)
                    },
                    position: userPos
                });

                // Request places to display near you within a 1000 metres
                request = {
                    location: userPos,
                    radius: '1000',
                    types: ['restaurant']
                };

                // Initiate a place nearby search
                service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, displayRestaurants);

                // Add eventListener to dispaly results depending on change bounds
                map.addListener('dragend', function(event) {
                    // Clear previous markers and list ///////////////////////
                    clearMarkers(placeMarkers);
                    clearList();
                    // Display results
                    sorting.value = 'all';
                    requestBounds();
                    displayRestaurants();
                });

                // Add eventListener to dispaly results depending on zoom
                map.addListener('zoom_changed', function(event) {
                    // Clear previous markers and list
                    clearMarkers(placeMarkers);
                    clearList();
                    // Display results
                    sorting.value = 'all';
                    requestBounds();
                    displayRestaurants();
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

                // Set default position to Spain
                pos = { lat: 40.4637, lng: 3.7492 };
                // Set map center and zoom if no geolocation
                map.setCenter(pos);
                map.setZoom(4);
                handleLocationError(true, infoLocationError, map.getCenter());
            });
    } else {
        // If browser doesn't support geolocation
        handleLocationError(false, infoLocationError, map.getCenter());
    }
}

// Geolocation error handling
const handleLocationError = function(browserHasGeolocation, infoLocationError, pos) {
    infoLocationError.setPosition(pos);
    infoLocationError.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation');
    infoLocationError.open(map);
}