// New request depending on map bounds
const requestBounds = function() {
    // Make a new request when event is triggered 
    request = {
        bounds: map.getBounds(),
        types: ['restaurant']
    };
}

// Display restaurants marker and list if map is within zoom range
const displayRestaurants = function() {
    if (map.zoom > 12) {
        // If any infowindow is open, close it
        if (lastWindow) lastWindow.close();
        restMarkersAndList();
        // getRestaurants();
    } else if (map.zoom <= 12) {
        outRange();
    }
}

// Display infoWindow error when map zoom is out of range
const outRange = function() {
    if (lastWindow) lastWindow.close();

    outOfRange = new google.maps.InfoWindow;
    centerMap = map.getCenter();
    outOfRange.setPosition(centerMap);
    outOfRange.setContent('Zoom in to search for restaurants');
    outOfRange.open(map);
    lastWindow = outOfRange;

    // Result dont show when zoom is too far
    sorting.addEventListener('change', function() {
        // Clear all results
        clearMarkers(placeMarkers);
        clearList();
    })
}

// Display marker in nearby search
const restMarkersAndList = function() {
    // Initiate new nearby search
    service.nearbySearch(request, function(results, status) {
        // Check if status is ok
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            // Display all restaurnat
            for (i = 0; i < results.length; i++) {
                place = results[i];
                createRestMarker(place);
                createList(place);
            }
            // Sort by rate
            sortByRate(results);
        }
    });
}

// Function to style markers
const styleMarker = function(markerColor) {
    markerIcon = new google.maps.MarkerImage(
        'http://maps.google.com/mapfiles/kml/pal2/' + markerColor + '.png',
        new google.maps.Size(30, 30),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 32),
        new google.maps.Size(30, 30));
    return markerIcon;
}

// clear previous restaurants list results 
const clearList = function() {
        while (divRest.firstChild)
            divRest.removeChild(divRest.firstChild);
    }
    // clear previous marker results 
const clearMarkers = function(markers) {
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = [];
}