// Define variables
var bounds, place, defaultIconRest, highlightedIconRest, markerRest, placeInfo, service, innerHTML, markerIcon, outOfRange, centerMap;

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

// Sort restaurants by star rating
const sortByRate = function(places) {
    // Sort restaurants by rate
    sorting.addEventListener('change', function() {

        // Clear results everytime sorting is updated
        clearMarkers(placeMarkers);
        clearList();

        for (i = 0; i < places.length; i++) {
            place = places[i];

            if (sorting.value === 'one') {

                if ((place.rating >= 1 && place.rating < 2) && (markerRest.rate >= 1 && markerRest.rate < 2)) {
                    createRestMarker(place);
                    createList(place);
                }
            } else if (sorting.value === 'two') {

                if ((place.rating >= 2 && place.rating < 3) && (markerRest.rate >= 2 && markerRest.rate < 3)) {
                    createRestMarker(place);
                    createList(place);
                }
            } else if (sorting.value === 'three') {

                if (place.rating >= 3 && place.rating < 4) {
                    createRestMarker(place);
                    createList(place);
                }

            } else if (sorting.value === 'four') {

                if ((place.rating >= 4 && place.rating < 5)) {
                    createRestMarker(place);
                    createList(place);
                }

            } else if (sorting.value === 'five') {

                if ((place.rating == 5) && (markerRest.rate == 5)) {
                    createRestMarker(place);
                    createList(place);
                }
            } else {

                createRestMarker(place);
                createList(place);
            }

        }
    });
}

// Create and style markers for restaurants
const createRestMarker = function(store) {

    // Create marker constructor for Restaurants
    markerRest = new google.maps.Marker({
        map: map,
        position: store.geometry.location,
        icon: defaultIconRest,
        title: store.name,
        id: store.place_id,
        animation: google.maps.Animation.DROP,
        rate: store.rating
    });

    // InfoWindow constructor for restaurants
    placeInfo = new google.maps.InfoWindow();

    // add eventListener to show markerRest infowindow
    markerRest.addListener('click', function() {
        // If another infowindow is open, close it before opening a new one
        if (lastWindow) lastWindow.close();
        getPlacesDetails(this, placeInfo);
        lastWindow = placeInfo;
    });

    // Style restaurants markers
    defaultIconRest = styleMarker('icon38');
    highlightedIconRest = styleMarker('icon41');

    markerRest.addListener('mouseover', function() {
        this.setIcon(highlightedIconRest);
    });
    markerRest.addListener('mouseout', function() {
        this.setIcon(defaultIconRest);
    });

    // Create restaurants markers and display restaurants list
    placeMarkers.push(markerRest);
    //createList(store)

}

// Create a DOM list with id
const createList = function(restaurant) {

    // declare and initialize all const for forEach loop
    const listRestaurant = document.createElement("div");
    const restLink = document.createElement("a");
    const restName = document.createElement("h5");
    const address = document.createElement("p");
    const restReview = document.createElement("p");
    const lineBreak = document.createElement("hr");

    restLink.appendChild(restName);
    restLink.appendChild(address);
    restLink.appendChild(restReview);
    restLink.appendChild(lineBreak);
    listRestaurant.appendChild(restLink);

    // Add content to display 
    restLink.id = restaurant.place_id;
    restLink.href = 'detailsRestaurant.html';
    restName.textContent = restaurant.name;
    address.textContent = restaurant.vicinity;
    // Add reviews rating as stars
    starRating(restaurant, restReview);

    // Append content to DOM to display restaurant info
    divRest.appendChild(listRestaurant);

    // Store clicked restaurant details
    restLink.addEventListener('click', function() {
        localStorage.setItem('restaurantDetails', restaurant.place_id);
    });
}

// Display stars as rating
const starRating = function(place, divInfo) {

    // Define maximum rate
    const stars = 5;
    // Convert rating into percentage
    const starPercentage = (place.rating / stars) * 100;
    // Round to nearest 10 to allow create half stars
    const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
    // Add result into DOM
    divInfo.innerHTML = '<div class="stars-outer"><div class="stars-inner"></div></div>' + ' ' + place.rating;
    // Fill stars color based on rating %
    divInfo.querySelector('.stars-inner').style.width = starPercentageRounded;
}

// Get place detail to fill infowindow
const getPlacesDetails = function(marker, infowindow) {

    // Get detail from each restaurant place id to display on infowindow
    service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function(place, status) {
        // Check if status is OK
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            // set marker property in this window so is not repeated
            infowindow.marker = marker;
            // Add html to infowindow with all deatil needed
            innerHTML = '<div>';
            // Check always if the detail requested exist
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            // (' + place.user_ratings_total + ')',
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.rating) {
                innerHTML += '<br> <strong>Ratings:</strong> ' + place.rating;
            }
            if (place.user_ratings_total) {
                innerHTML += ' <strong>Total ratings:</strong> ' + place.user_ratings_total;
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({ maxHeight: 100, maxWidth: 200 }) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // clear property if close infowindow
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
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