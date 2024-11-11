// weather display container 
var weatherContainer = document.getElementById('weather');
var formEl = document.querySelector('form');
var inputEl = document.querySelector('input');

// form
formEl.onsubmit = function (e) {
    e.preventDefault(); 
    
    // user input
    var userInput = inputEl.value.trim();
    
    if (!userInput) return; 

    // weather data and display it if found, otherwise display error message
    getWeather(userInput)
        .then(displayWeatherInfo)
        .catch(displayLocNotFound);
    
    inputEl.value = ""; 
};

//  fetch weather data from the API
function getWeather(query) {
    // default 'us'
    if (!query.includes(",")) query += ',us';

    // weather data from OpenWeatherMap API
    return fetch(
        'https://api.openweathermap.org/data/3.0/weather?q=' + query + '&units=imperial&APPID=6f472cfbf92aff8f9ee810374f0c3e63'
    )
    .then(function (res) {
        return res.json(); 
    })
    .then(function (data) {
        // error if the location is not found
        if (data.cod === "404") throw new Error('location not found');

        // weather information from API data
        var iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        var description = data.weather[0].description;
        var actualTemp = data.main.temp;
        var feelsLikeTemp = data.main.feels_like;
        var place = data.name + ", " + data.sys.country;
        var updatedAt = new Date(data.dt * 1000);

        //  structured weather data
        return {
            coords: data.coord.lat + "," + data.coord.lon,
            description: description,
            iconUrl: iconUrl,
            actualTemp: actualTemp,
            feelsLikeTemp: feelsLikeTemp,
            place: place,
            updatedAt: updatedAt
        };
    });
}

// display an error message if the location is not found
function displayLocNotFound() {
    weatherContainer.innerHTML = ""; // clear previous

    // error message
    var errMsg = document.createElement('h2');
    errMsg.textContent = "Location not found";
    weatherContainer.appendChild(errMsg);
}

// display fetched weather data
function displayWeatherInfo(weatherObj) {
    weatherContainer.innerHTML = ""; // Clear previous weather data

    // line break
    function addBreak() {
        weatherContainer.appendChild(document.createElement('br'));
    }

    // location name
    var placeName = document.createElement('h2');
    placeName.textContent = weatherObj.place;
    weatherContainer.appendChild(placeName);

    // Google Maps link 
    var whereLink = document.createElement('a');
    whereLink.textContent = "Click to view map";
    whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords;
    whereLink.target = "_BLANK";
    weatherContainer.appendChild(whereLink);

    // weather condition icon
    var icon = document.createElement('img');
    icon.src = weatherObj.iconUrl;
    weatherContainer.appendChild(icon);

    // weather description
    var description = document.createElement('p');
    description.textContent = weatherObj.description;
    description.style.textTransform = 'capitalize'; // Capitalize
    weatherContainer.appendChild(description);

    addBreak(); // line break

    // actual temperature
    var temp = document.createElement('p');
    temp.textContent = "Current: " + weatherObj.actualTemp + "℉";
    weatherContainer.appendChild(temp);

    // 'feels like' temperature
    var feelsLikeTemp = document.createElement('p');
    feelsLikeTemp.textContent = "Feels Like: " + weatherObj.feelsLikeTemp + "℉";
    weatherContainer.appendChild(feelsLikeTemp);

    addBreak(); // Add another line break

    // last updated time
    var updatedAt = document.createElement('p');
    updatedAt.textContent = "Last updated: " + weatherObj.updatedAt.toLocaleTimeString(
        'en-US',
        { hour: 'numeric', minute: '2-digit' }
    );
    weatherContainer.appendChild(updatedAt);
}