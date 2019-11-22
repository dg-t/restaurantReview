async function getRestaurants() {

    // fetch data, await response, and save it in a variable
    const url = 'localData/localRestaurants.json';
    const response = await fetch(url);
    const result = await response.json();

    // if there is any response run code
    if (result) {

        // Run function for each restaurant
        result.forEach(i => {
            // Declare all variables for forEach loop
            var infoRestaurnat, location, markerRest, ratingArr, sumStars, sumRatings, sumRatingStars, request;

            // declare and initialize all const for forEach loop
            const restName = document.createElement("h5");
            const address = document.createElement("p");
            const restReview = document.createElement("p");
            const lineBreak = document.createElement("hr");

            // Define restuarant location and add a marker
            infoRestaurnat = new google.maps.InfoWindow;
            location = new google.maps.LatLng(i.lat, i.long);
            markerRest = new google.maps.Marker({
                position: location,
                title: i.restaurantName,
                map: map
            });

            // assign value for each var for nested forEach
            ratingArr = i.ratings;
            sumStars = 0;
            sumRatings = i.ratings.length;
            sumRatingStars;

            // Nest a forEach loop to get average rating for each restaurant
            ratingArr.forEach(function(obj) {
                // Calculate average rating 
                sumStars += obj['stars'];
                sumRatingStars = Math.round((sumStars / sumRatings) * 10) / 10;
            });

            // Add content to display 
            restName.textContent = i.restaurantName;
            address.textContent = i.address;
            restReview.textContent = sumRatingStars + ' Stars';

            // Append content to DOM to display restaurant info
            divRest.appendChild(restName);
            divRest.appendChild(address);
            divRest.appendChild(restReview);
            divRest.appendChild(lineBreak);
            divRest.appendChild(document.createElement('br'));

            // EventListener to show restaurant infoWindow
            markerRest.addListener('click', function() {
                // check if a window is open, and close it when opening another
                if (lastWindow) lastWindow.close();
                infoRestaurnat.open(map, this);
                infoRestaurnat.setContent(i.restaurantName.bold().fontsize(4) + '<br>' + i.address + '<br>' + sumRatingStars + ' Stars');
                lastWindow = infoRestaurnat;
            });
        });
    }

}