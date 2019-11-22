// Callback function to check status is ok to display restaurants for nearbySearch()
var callback = function(results, status) {

    // If status is OK return markers
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        markers.push(createMarkers(results));
    }
}

// Create marker for restaurants
var createMarkers = function(places) {
    // Bound map to specific size
    var bounds = new google.maps.LatLngBounds();

    // Loop for all places found
    for (var i = 0; i < places.length; i++) {
        var place = places[i];

        // Style marker on hoover
        var defaultIconRest = styleMarker('red');
        var highlightedIconRest = styleMarker('ylw');

        // Create marker constructor for Restaurants
        var markerRest = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: defaultIconRest,
            title: place.name,
            id: place.place_id,
            animation: google.maps.Animation.DROP
        });

        // extend bounderies of map to keep all markers into the visible map
        bounds.extend(markerRest.position);

        // InfoWindow constructor for restaurants
        var placeInfo = new google.maps.InfoWindow();

        // add eventListener to show markerRest infowindow
        markerRest.addListener('click', function() {

            // If another infowindow is open, close it before opening a new one
            if (lastWindow) lastWindow.close();
            getPlacesDetails(this, placeInfo);
            lastWindow = placeInfo;
        });

        // 
        markerRest.addListener('mouseover', function() {
            this.setIcon(highlightedIconRest);
        });
        markerRest.addListener('mouseout', function() {
            this.setIcon(defaultIconRest);
        });

        if (place.geometry.viewport) {
            //only geocode have viewport
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }

        // Create markers and display them as a list
        placeMarkers.push(markerRest);
        createList(place);
    }
    // map will fit to keep all marker in it
    map.fitBounds(bounds);
}

// Create a DOM list with id
var createList = function(restaurant) {

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
    restLink.href = restaurant.place_id;
    restName.textContent = restaurant.name;
    address.textContent = restaurant.vicinity;
    restReview.textContent = restaurant.rating + ' Stars ' + ' (' + restaurant.user_ratings_total + ')';

    // Append content to DOM to display restaurant info
    divRest.appendChild(listRestaurant);
}

// Get place detail to fill infowindow
var getPlacesDetails = function(marker, infowindow) {

    // Get detail from each restaurant place id to display on infowindow
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function(place, status) {
        // Check if status is OK
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            // set marker property in this window so is not repeated
            infowindow.marker = marker;
            // Add html to infowindow with all deatil needed
            var innerHTML = '<div>';
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
var styleMarker = function(markerColor) {
    var markerIcon = new google.maps.MarkerImage(
        'http://maps.google.com/mapfiles/kml/paddle/' + markerColor + '-circle.png',
        new google.maps.Size(34, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 32),
        new google.maps.Size(34, 34));
    return markerIcon;
}

// clear previous restaurants list results 
var clearList = function() {
        while (divRest.firstChild)
            divRest.removeChild(divRest.firstChild);
    }
    // clear previous marker results 
var clearMarkers = function(markers) {
    for (var m in markers) {
        markers[m].setMap(null)
    }
    markers = [];
}