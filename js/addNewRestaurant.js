// Check if restaurant exist
const displayNewRestInfo = function() {
    if (restaurantIsNew) {
        newInfoRestaurant.open(map, this);
        createFormInfoWindow(this);
        newRestaurants.push(this);
        newRestId += 1;
    } else {
        newRestInfoWindow(this, newInfoRestaurant);
    }
}

// Create form to add a new restaurant
const createFormInfoWindow = function(newMarkerRest) {

    form.id = 'createRestaurant';
    form.action = 'post';

    form.innerHTML = `<h3 class="createRestHeading add-res-heading">Create your Restaurant</h3>
    <input type="text" id="restName" name="restName" placeholder="Restaurant Name" required/>
    <input type="text" name="restAddress" id="restAddress" placeholder="Restaurant Address" required/><br>
    <input type="hidden" id="restLat" name="restLat" value="${newMarkerRest.position.lat()}"/>
    <input type="hidden" id="restLng" name="restLng" value="${newMarkerRest.position.lng()}"/>
    <br>
    <button type="submit" id="addRestaurant" class="btn addRestaurant">Create Restaurant</button>`;

    newInfoRestaurant.setContent(form);
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    var name = document.getElementById('restName');
    var address = document.getElementById('restAddress');
    var newRestLat = document.getElementById('restLat');
    var newRestLng = document.getElementById('restLng');
    var position = new google.maps.LatLng(newRestLat.value, newRestLng.value);

    var place = {
        placeId: newMarkerRest.id,
        name: name.value,
        vicinity: address.value,
        rating: totalRating,
        position: position,
        icon: '../img/restaurant.jpg',
        reviews: ''
    };

    // Push place in newPlace array
    newPlace.push(place);
    // Save new place information 
    sessionStorage.setItem('newPlace', JSON.stringify(newPlace));
    sessionStorage.setItem('newMarker', newMarkerRest.id);
    // Create restaurants markers and display restaurants list
    restaurantIsNew = false;
    newInfoRestaurant.close(map, newMarkerRest);
    newMarkerRest = newRestaurants[newRestId];
    newRestInfoWindow(newMarkerRest, newInfoRestaurant);
    createList(place);
});

// Create infowindow for new restaurant
const newRestInfoWindow = function(newMarkerRest, newInfoRestaurant) {

    place = JSON.parse(sessionStorage.getItem('newPlace'));

    for (p = 0; p < place.length; p++) {
        if (place[p].placeId == newMarkerRest.id) {

            // declare and initialize all elements for infoWindow

            const infoDiv = document.createElement("div");
            const infoPlace = document.createElement("div");
            const divLink = document.createElement("div");
            const divImg = document.createElement("div");
            const infoName = document.createElement("h6");
            const infoImage = document.createElement("img");
            const infoLink = document.createElement("a");


            if (place[p].icon) {
                infoImage.src = place[p].icon;
                infoImage.alt = 'Restaurant image';
                infoImage.className = 'infoImage';
                divImg.appendChild(infoImage);
                infoDiv.appendChild(divImg);
            }
            if (place[p].name) {
                infoName.textContent = place[p].name;
                infoName.className = 'infoName';
                infoPlace.appendChild(infoName);
                infoDiv.appendChild(infoPlace);
            }


            // Add link to see restaurant details
            infoLink.id = place[p].placeId;
            infoLink.href = 'detailsRestaurant.html';
            infoLink.textContent = 'More info';
            infoLink.className = 'infoLink';
            infoPlace.className = 'infoPlace';
            infoDiv.className = 'infoDiv';
            divLink.appendChild(infoLink);
            infoDiv.appendChild(divLink);

            // Remove localStorage results
            infoLink.addEventListener('click', function() {
                localStorage.removeItem('restaurantDetails');
            });

            // Close any last infoWindow and Open new restaurant info
            if (lastWindow) lastWindow.close();
            newInfoRestaurant.setContent(infoDiv);
            newInfoRestaurant.open(map, newMarkerRest);
            lastWindow = newInfoRestaurant;
        }
    }
}