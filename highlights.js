function initializePlacesService() {
    const map = new google.maps.Map(document.createElement('div'));
    placesService = new google.maps.places.PlacesService(map);
}

// Function to fetch places based on type and location
function fetchPlacesByType(location, type, listElementId) {
    const request = {
        query: location,
        fields: ['geometry'],
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            const locationLatLng = new google.maps.LatLng(lat(), lng());

            const nearbyRequest = {
                location: locationLatLng,
                radius: 5000, // 5 km radius
                type: type,
            };

            placesService.nearbySearch(nearbyRequest, (nearbyResults, nearbyStatus) => {
                if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK) {
                    const listElement = document.getElementById(listElementId);
                    listElement.innerHTML = '';

                    nearbyResults.forEach((place) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = place.name;
                        listElement.appendChild(listItem);
                    });
                } else {
                    console.error('Nearby search failed:', nearbyStatus);
                }
            });
        } else {
            console.error('Place not found:', status);
        }
    });
}

// Event listener for the highlights form submission
document.getElementById('highlights-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.getElementById('highlights-location-input').value;

    if (!placesService) {
        initializePlacesService();
    }

    // Fetch attractions
    fetchPlacesByType(location, 'tourist_attraction', 'attractions-list');

    // Fetch restaurants
    fetchPlacesByType(location, 'restaurant', 'restaurants-list');

    // Fetch activities (e.g., parks)
    fetchPlacesByType(location, 'park', 'activities-list');
});

// Initialize the Places service when the window loads
window.onload = initializePlacesService;
