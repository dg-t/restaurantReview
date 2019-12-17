// Create and style markers for restaurants
const createRestMarker = function(store) {

    // Create marker constructor for Restaurants
    markerRest = new google.maps.Marker({
        map: map,
        position: store.geometry.location,
        icon: 'http://maps.google.com/mapfiles/kml/pal2/icon38.png',
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
    listRestaurant.appendChild(restLink);

    // Add content to display 
    divRest.className = 'restaurantList';
    restLink.id = restaurant.place_id;
    restLink.href = 'detailsRestaurant.html';
    restLink.className = 'restaurantLinks';
    restName.textContent = restaurant.name;
    address.textContent = restaurant.vicinity;
    // Add reviews rating as stars
    starRating(restaurant, restReview);

    // Append content to DOM to display restaurant info
    divRest.appendChild(listRestaurant);
    divRest.appendChild(restReview);
    divRest.appendChild(lineBreak);

    // Store clicked restaurant details
    restLink.addEventListener('click', function() {
        localStorage.setItem('restaurantDetails', restaurant.place_id);
    });
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

            // declare and initialize all elements for infoWindow
            const infoDiv = document.createElement("div");
            const infoPlace = document.createElement("div");
            const infoRateDiv = document.createElement("div");
            const divLink = document.createElement("div");
            const divImg = document.createElement("div");
            const infoName = document.createElement("h6");
            const infoRate = document.createElement("p");
            const infoImage = document.createElement("img");
            const infoLink = document.createElement("a");

            // Check always if the detail requested exist
            // Add content and append to DOM to display restaurant info
            if (place.photos) {
                infoImage.src = place.photos[0].getUrl();
                infoImage.alt = 'Restaurant image';
                infoImage.className = 'infoImage';
                divImg.appendChild(infoImage);
                infoDiv.appendChild(divImg);
            }
            if (place.name) {
                infoName.textContent = place.name;
                infoName.className = 'infoName';
                infoPlace.appendChild(infoName);
                infoDiv.appendChild(infoPlace);
            }
            if (place.rating) {
                infoRate.textContent = starRating(place, infoRateDiv);
                infoRateDiv.appendChild(infoRate);
                infoPlace.appendChild(infoRateDiv);
                infoDiv.appendChild(infoPlace);
            }
            if (place.user_ratings_total) {
                infoRate.textContent += '(' + place.user_ratings_total + ')';
                infoRate.className = 'infoRate';
                infoRateDiv.appendChild(infoRate);
                infoPlace.appendChild(infoRateDiv);
                infoDiv.appendChild(infoPlace);
            }

            // Add link content
            infoLink.id = place.place_id;
            infoLink.href = 'detailsRestaurant.html';
            infoLink.textContent = 'More info';
            infoLink.className = 'infoLink';
            // add div class and append link
            infoPlace.className = 'infoPlace';
            infoDiv.className = 'infoDiv';
            divLink.appendChild(infoLink);
            infoDiv.appendChild(divLink);

            // Store clicked restaurant details
            infoLink.addEventListener('click', function() {
                localStorage.setItem('restaurantDetails', place.place_id);
            });

            // Display content in infoWindow
            infowindow.setContent(infoDiv);
            infowindow.open(map, marker);
            // clear property if close infowindow
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    });
}