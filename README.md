# IMPORTANT INFORMATION

### Generate your own API KEY

If the website is not working, it would probably be for an issue with the API key.
Please, add you own google map API key in order to load the map information.

Information about how to get your own API key:
<https://developers.google.com/maps/documentation/embed/get-api-key>

Once you have your own API key, just replace it in both html file and detailsRestaurant.js with the current API key.

For html file:
`<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&v=3&callback=initMap"></script>`

For the js file:
`const url = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=' + detailRest + '&key=YOUR_API_KEY_API_KEY';`

