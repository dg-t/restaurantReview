const getDetailsRest = async function() {

    // Retrive restaurant stored details
    detailRest = localStorage.getItem('restaurantDetails');
    newPlace = JSON.parse(sessionStorage.getItem('newPlace'));
    newMarker = sessionStorage.getItem('newMarker');

    // fetch data sending request to a proxy, await response, and save it in a variable
    const url = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + detailRest + '&key=AIzaSyB_nN8ldrp5JR-5NIYVQKS9shRVPoe43KI';
    const response = await fetch(url);
    const result = await response.json();

    // Display new restaurant details
    if (result.status == "INVALID_REQUEST") {

        for (p = 0; p < newPlace.length; p++) {
            if (newPlace[p].placeId == newMarker) {

                const newRestName = document.createElement('h3');
                const totalRate = document.createElement('p');
                const allReview = document.createElement('p');
                const addReviewButton = document.createElement('button');

                newRestName.id = 'nameRest';
                newRestName.textContent = newPlace[p].name;
                addReviewButton.id = 'addReviewButton';
                addReviewButton.setAttribute("data-toggle", "modal");
                addReviewButton.setAttribute("data-target", "#modalReview");

                totalRate.innerHTML = '<b>Total Rating:</b> ' + totalRating + '<b> Total Reviews:</b> ' + newPlace[p].reviews.length; // + newPlace.reviews.length
                allReview.innerHTML = '<b> All reviews: </b>';
                addReviewButton.textContent = 'Add review';
                allReview.appendChild(addReviewButton);

                restaurantName.appendChild(newRestName);
                restaurantName.appendChild(totalRate);
                restaurantName.appendChild(allReview);

                // Display reviews
                for (r = 0; r <= newPlace[p].reviews.length; r++) {

                    if (newPlace[p].reviews.length == 0) { noReview.style.display = 'block'; }

                    const reviews = document.createElement("div");
                    const reviewAuthor = document.createElement("p");
                    const rate = document.createElement("p");
                    const reviewText = document.createElement("p");

                    // Create a div for each review
                    reviews.appendChild(reviewAuthor);
                    reviews.appendChild(rate);
                    reviews.appendChild(reviewText);
                    if (newPlace[p].reviews.length > 0) { starRating(newPlace.reviews[r], rate) }

                    infoDiv.appendChild(reviews);

                    formReview.addEventListener("submit", function(e) {
                        e.preventDefault();
                        submitReview();

                        totalRating = Math.round(newRateReview / (newReviewArray.length) * 10) / 10;
                        totalRate.innerHTML = '<b>Total Rating:</b> ' + totalRating + '<b> Total Reviews:</b> ' + newReviewArray.length;
                    });
                }

                newRestPos = newPlace[p].position;

                map = new google.maps.Map(pano, {
                    center: newRestPos,
                    zoom: 14
                });

                // Show dynamic street view
                panorama = new google.maps.StreetViewPanorama(
                    pano, {
                        position: newRestPos,
                        pov: {
                            heading: 45,
                            pitch: 5
                        }
                    });
                map.setStreetView(panorama);
            }
        }
    }

    // Display real restaurant details
    else if (result.status === 'OK') {

        // Variables
        panorama;
        restaurant = result.result;
        restaurantLocation = restaurant.geometry.location;
        // Define map
        map = new google.maps.Map(pano, {
            center: restaurantLocation,
            zoom: 15
        });

        // Display Restaurant name in DOM
        const restName = document.createElement('h3');
        const totalRate = document.createElement('p');
        const allReview = document.createElement('p');
        const addReviewButton = document.createElement('button');

        restName.id = 'nameRest';
        addReviewButton.id = 'addReviewButton';
        addReviewButton.setAttribute("data-toggle", "modal");
        addReviewButton.setAttribute("data-target", "#modalReview");

        if (restaurant.name) { restName.textContent = restaurant.name; } else { restaurant.name.textContent = 'No name is available'; }
        if (restaurant.rating) { totalRate.innerHTML = '<b>Total Rating:</b> ' + restaurant.rating + '<b> Total Reviews:</b> ' + restaurant.user_ratings_total; } else { restaurant.rating.textContent = 'No rating available'; }
        allReview.innerHTML = '<b> All reviews: </b>';
        addReviewButton.textContent = 'Add review';
        allReview.appendChild(addReviewButton);

        restaurantName.appendChild(restName);
        restaurantName.appendChild(totalRate);
        restaurantName.appendChild(allReview);

        if (restaurant.reviews) {
            // Display reviews
            for (r = 0; r < restaurant.reviews.length; r++) {
                showReviews = restaurant.reviews[r];
                const reviews = document.createElement("div");
                const reviewAuthor = document.createElement("p");
                const rate = document.createElement("p");
                const reviewText = document.createElement("p");
                const lineBreak = document.createElement("hr");

                reviewAuthor.className = 'displayReview';
                rate.className = 'displayReview';
                reviewText.className = 'displayReview';

                // Create a div for each review
                reviews.appendChild(reviewAuthor);
                reviews.appendChild(rate);
                reviews.appendChild(reviewText);
                reviews.appendChild(lineBreak);

                // Add content to display 
                reviewAuthor.innerHTML = '<img src="' + restaurant.reviews[r].profile_photo_url + '" height="42" width="42" alt= "Author image"> <strong>' + restaurant.reviews[r].author_name + '</strong>';
                reviewText.textContent = restaurant.reviews[r].text;
                // Add reviews rating as stars
                starRating(restaurant.reviews[r], rate);

                // Append content to DOM to display restaurant info
                infoDiv.appendChild(reviews);

                initialRate += parseInt(restaurant.reviews[r].rating);
            }

            formReview.addEventListener("submit", function(e) {
                e.preventDefault();
                submitReview();
                restaurant.user_ratings_total += 1;
                restaurant.rating = Math.round(((initialRate + newRateReview) / (5 + newReviewArray.length)) * 10) / 10;
                totalRate.innerHTML = '<b>Total Rating:</b> ' + restaurant.rating + '<b> Total Reviews:</b> ' + restaurant.user_ratings_total;
            });
        } else {
            restaurant.reviews.textContent = 'No reviews yet';
        }

        // Display street view panorama if available
        if (google.maps.StreetViewStatus.OK) {
            // Show dynamic street view
            panorama = new google.maps.StreetViewPanorama(
                pano, {
                    position: restaurantLocation,
                    pov: {
                        heading: 45,
                        pitch: 5
                    }
                });
        } else {
            panorama = 'No street View Panorama available';
        }
        map.setStreetView(panorama);
    } else {
        pageResult.textContent = 'No results for this search';
    }
}
getDetailsRest();