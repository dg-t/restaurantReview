const submitReview = function() {

    newRateReview = 0;
    newName = document.getElementById("authorName");
    newRating = document.getElementById("authorRating");
    newReview = document.getElementById("authorReview");
    if (!(newName.value && newRating.value && newReview.value)) {
        return;
    }
    createReview(newName.value, newRating.value, newReview.value);
    //reset form values
    newName.value = "";
    newRating.value = "";
    newReview.value = "";

    for (n = 0; n < newReviewArray.length; n++) {
        newRateReview += parseInt(newReviewArray[n].rating);
    }

    noReview.style.display = 'none';
    $('#modalReview').modal('toggle');
}

const createReview = function(newName, newRating, newReview) { //add to array and to the page
    newReviewDetails = {
        name: newName,
        rating: newRating,
        review: newReview,
    };

    // Append content to DOM to display restaurant info
    const addReview = document.getElementById('infoRestaurant');
    const yourReview = document.createElement("div");
    const reviewAuthor = document.createElement("p");
    const rate = document.createElement("p");
    const reviewText = document.createElement("p");
    const lineBreak = document.createElement("hr");

    reviewAuthor.className = 'displayReview';
    rate.className = 'displayReview';
    reviewText.className = 'displayReview';

    // Add content to display 
    reviewAuthor.innerHTML = '<img src="../img/user.png" height="42" width="42" alt= "Author image"> <strong>' + newReviewDetails.name + '</strong>';
    reviewText.textContent = newReviewDetails.review;
    // Add reviews rating as stars
    starRating(newReviewDetails, rate);

    // Create a div for each review
    yourReview.appendChild(reviewAuthor);
    yourReview.appendChild(rate);
    yourReview.appendChild(reviewText);
    yourReview.appendChild(lineBreak);

    newReviewArray.push(newReviewDetails);
    addReview.insertBefore(yourReview, addReview.childNodes[1]);
}