// GLOBAL VARIABLES

// Variables map and markers
var map, pos, markerUserPos, infoLocationError, service, userPos, request;
var bounds, place, defaultIconRest, highlightedIconRest, markerRest, placeInfo, service, innerHTML, markerIcon, outOfRange, centerMap, checkRate;
var lastWindow = null;
var markers = [];
var divRest = document.getElementById('showRestaurant');
var sorting = document.getElementById('sort');
var placeMarkers = [];

// Variables for add new restaurant
var form = document.createElement('form');
var formInfoWindow, newInfoRestaurant, latlng, newMarker;
var newMarkerRest = [];
var newRestaurants = [];
var newPlace = [];
var newRestId = -1;
var totalRating = 0;
var restaurantIsNew = true;

// Variables second html page
var pageResult = document.getElementById('detailsContainer');
var restaurantName = document.getElementById('restaurantName');
var infoDiv = document.getElementById('infoRestaurant');
var pano = document.getElementById('streetView');
var formReview = document.getElementById("formReview");
var noReview = document.getElementById('noReview');
var initialRate = 0;
var newReviewArray = [];
var restaurant, restaurantLocation, panorama, newPlace, detailRest, newMarker, newRestPos, newRateReview, newName, newRating, newReview, newReviewDetails;

// Map function
var initMap = function() {

    // Create a map from the Map constructor
    map = new google.maps.Map(document.getElementById('map'));

    // Create infoWindow for geolocation error handling
    infoLocationError = new google.maps.InfoWindow;
    // create infoWindow for form add new restaurant
    formInfoWindow = new google.maps.InfoWindow({
        content: form
    });
    // New restaurant infoWindow
    newInfoRestaurant = new google.maps.InfoWindow;

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
                    // Clear previous markers and list 
                    clearMarkers(placeMarkers);
                    clearList();
                    // Display results
                    sorting.value = 'Search all..';
                    requestBounds();
                    displayRestaurants();
                    // getRestaurants();
                });

                // Add eventListener to dispaly results depending on zoom
                map.addListener('zoom_changed', function(event) {
                    // Clear previous markers and list
                    clearMarkers(placeMarkers);
                    clearList();
                    // Display results
                    sorting.value = 'Search all..';
                    requestBounds();
                    displayRestaurants();
                    // getRestaurants();
                });

                // EventListener to show user infoWindow
                markerUserPos.addListener('click', function() {
                    // check if a window is open, and close it when opening another
                    if (lastWindow) lastWindow.close();
                    infoCurrentPos.open(map, markerUserPos);
                    infoCurrentPos.setContent('Your position');
                    lastWindow = infoCurrentPos;
                });

                // Create new restaurant marker
                map.addListener('rightclick', function(e) {

                    formInfoWindow.close(map, newMarkerRest);
                    restaurantIsNew = true;

                    if (lastWindow) lastWindow.close();
                    latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                    // Create marker constructor for Restaurants
                    newMarkerRest = new google.maps.Marker({
                        map: map,
                        position: latlng,
                        icon: defaultIconRest,
                        id: newRestId + 1,
                        animation: google.maps.Animation.DROP
                    });

                    // Style restaurants markers
                    defaultIconRest = styleMarker('icon38');
                    highlightedIconRest = styleMarker('icon41');

                    newMarkerRest.addListener('mouseover', function() {
                        this.setIcon(highlightedIconRest);
                    });
                    newMarkerRest.addListener('mouseout', function() {
                        this.setIcon(defaultIconRest);
                    });

                    // Add new restaurant marker in markers array
                    placeMarkers.push(newMarkerRest);

                    // On click open infoWindow
                    newMarkerRest.addListener('click', displayNewRestInfo);
                    if (lastWindow) lastWindow.close();
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