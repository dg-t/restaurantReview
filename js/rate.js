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

// Sort restaurants by star rating
const sortByRate = function(places) {
    // Sort restaurants by rate
    sorting.addEventListener('change', function() {

        // Clear results everytime sorting is updated
        clearMarkers(placeMarkers);
        clearList();
        checkRate = [];

        for (i = 0; i < places.length; i++) {
            place = places[i];
            if (sorting.value === 'one') {
                if (place.rating >= 1 && place.rating < 2) {
                    createRestMarker(place);
                    createList(place);
                    checkRate.push(place);
                }
            } else if (sorting.value === 'two') {
                if (place.rating >= 2 && place.rating < 3) {
                    createRestMarker(place);
                    createList(place);
                    checkRate.push(place);
                }
            } else if (sorting.value === 'three') {
                if (place.rating >= 3 && place.rating < 4) {
                    createRestMarker(place);
                    createList(place);
                    checkRate.push(place);
                }
            } else if (sorting.value === 'four') {
                if ((place.rating >= 4 && place.rating < 5)) {
                    createRestMarker(place);
                    createList(place);
                    checkRate.push(place);
                }
            } else if (sorting.value === 'five') {
                if ((place.rating == 5) && (markerRest.rate == 5)) {
                    createRestMarker(place);
                    createList(place);
                    checkRate.push(place);
                }
            } else {
                createRestMarker(place);
                createList(place);
                checkRate.push(place);
            }
        }

        const noOption = document.createElement('p');
        if (!(checkRate.length > 0)) {
            noOption.textContent = 'No restaurants with this rating';
            divRest.appendChild(noOption);
        } else if (checkRate.length > 0) { noOption.style.display = 'none'; }
    });
}