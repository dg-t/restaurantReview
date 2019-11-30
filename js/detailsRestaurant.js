const getDetailsRest = async function() {
    // target div where to display information
    var pageResult = document.getElementById('detailsContainer');
    var restaurantName = document.getElementById('restaurantName');
    var infoDiv = document.getElementById('infoRestaurant');
    var pano = document.getElementById('streetView');



    // Retrive restaurant stored details
    detailRest = localStorage.getItem('restaurantDetails');

    // fetch data sending request to a proxy, await response, and save it in a variable
    const url = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + detailRest + '&key=AIzaSyB_nN8ldrp5JR-5NIYVQKS9shRVPoe43KI';
    const response = await fetch(url);
    const result = await response.json();

    // if there is any response run code
    if (result.status === 'OK') {

        // Variables
        var panorama;
        var restaurant = result.result;
        var restaurantLocation = restaurant.geometry.location;
        // Define map
        map = new google.maps.Map(pano, {
            center: restaurantLocation,
            zoom: 15
        });

        // Display Restaurant name in DOM
        const restName = document.createElement('h3');
        const allReview = document.createElement('p');
        const totalRate = document.createElement('p');
        const lineBreak = document.createElement("hr");

        restName.id = 'nameRest';
        if (restaurant.name) { restName.textContent = restaurant.name; } else { restaurant.name.textContent = 'No name is available'; }
        if (restaurant.rating) { totalRate.innerHTML = '<b>Total Rating:</b> ' + restaurant.rating + '<b> Total Reviews:</b> ' + restaurant.user_ratings_total; } else { restaurant.rating.textContent = 'No rating is available'; }
        allReview.innerHTML = '<b> All reviews: </b>';

        restaurantName.appendChild(restName);
        restaurantName.appendChild(totalRate);
        restaurantName.appendChild(allReview);
        restaurantName.appendChild(lineBreak);

        if (restaurant.reviews) {
            // Display reviews
            for (r = 0; r < restaurant.reviews.length; r++) {
                showReviews = restaurant.reviews[r];
                const reviews = document.createElement("div");
                const reviewAuthor = document.createElement("p");
                const rate = document.createElement("p");
                const reviewText = document.createElement("p");
                const lineBreak = document.createElement("hr");

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
            }
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