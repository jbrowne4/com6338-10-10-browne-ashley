// Selectors for the weather container, form, and input
var weatherContainer = document.getElementById('weather-container');
var formEl = document.querySelector('form');
var inputEl = document.querySelector('input');

// Form submission event
formEl.onsubmit = function (e) {
    e.preventDefault();
    
    var userInput = inputEl.value.trim();
    if (!userInput) return;

    getWeather(userInput)
        .then(displayWeatherInfo)
        .catch(displayLocNotFound);

    getForecast(userInput)
        .then(displayForecast)
        .catch(displayLocNotFound);

    inputEl.value = ""; 
};

// Fetch current weather data
function getWeather(query) {
    if (!query.includes(",")) query += ',us';

    return fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=imperial&APPID=6f472cfbf92aff8f9ee810374f0c3e63'
    )
    .then(function (res) {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(function (data) {
        if (data.cod === "404") throw new Error('location not found');

        var iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        var description = data.weather[0].description;
        var actualTemp = data.main.temp;
        var feelsLikeTemp = data.main.feels_like;
        var place = data.name + ", " + data.sys.country;
        var updatedAt = new Date(data.dt * 1000);

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

// Fetch 5-day weather forecast data
function getForecast(query) {
    if (!query.includes(",")) query += ',us';

    return fetch(
        'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&units=imperial&APPID=6f472cfbf92aff8f9ee810374f0c3e63'
    )
    .then(function (res) {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(function (data) {
        if (data.cod === "404") throw new Error('location not found');

        var dailyForecasts = [];
        
        // Extract one forecast per day, around midday (12:00 PM) for best daily overview
        for (let i = 0; i < data.list.length; i += 8) {
            var forecast = data.list[i];
            dailyForecasts.push({
                date: new Date(forecast.dt * 1000),
                description: forecast.weather[0].description,
                iconUrl: 'https://openweathermap.org/img/wn/' + forecast.weather[0].icon + '@2x.png',
                temp: forecast.main.temp
            });
        }

        return dailyForecasts;
    });
}

// Display an error message if location not found
function displayLocNotFound() {
    weatherContainer.innerHTML = "";
    var errMsg = document.createElement('h2');
    errMsg.textContent = "Location not found";
    weatherContainer.appendChild(errMsg);
}

// Display current weather information
function displayWeatherInfo(weatherObj) {
    weatherContainer.innerHTML = "";
    var placeName = document.createElement('h2');
    placeName.textContent = weatherObj.place;
    weatherContainer.appendChild(placeName);

    var whereLink = document.createElement('a');
    whereLink.textContent = "Click to view map";
    whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords;
    whereLink.target = "_BLANK";
    weatherContainer.appendChild(whereLink);

    var icon = document.createElement('img');
    icon.src = weatherObj.iconUrl;
    weatherContainer.appendChild(icon);

    var description = document.createElement('p');
    description.textContent = weatherObj.description;
    description.style.textTransform = 'capitalize';
    weatherContainer.appendChild(description);

    var temp = document.createElement('p');
    temp.textContent = "Current: " + weatherObj.actualTemp + "℉";
    weatherContainer.appendChild(temp);

    var feelsLikeTemp = document.createElement('p');
    feelsLikeTemp.textContent = "Feels Like: " + weatherObj.feelsLikeTemp + "℉";
    weatherContainer.appendChild(feelsLikeTemp);

    var updatedAt = document.createElement('p');
    updatedAt.textContent = "Last updated: " + weatherObj.updatedAt.toLocaleTimeString(
        'en-US',
        { hour: 'numeric', minute: '2-digit' }
    );
    weatherContainer.appendChild(updatedAt);
}

// Display 5-day weather forecast
function displayForecast(forecastData) {
    var forecastContainer = document.createElement('div');
    forecastContainer.id = 'forecast-container';

    forecastData.forEach(function(dayForecast) {
        var dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';

        var date = document.createElement('h3');
        date.textContent = dayForecast.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
        dayDiv.appendChild(date);

        var icon = document.createElement('img');
        icon.src = dayForecast.iconUrl;
        dayDiv.appendChild(icon);

        var temp = document.createElement('p');
        temp.textContent = "Temp: " + dayForecast.temp + "℉";
        dayDiv.appendChild(temp);

        var description = document.createElement('p');
        description.textContent = dayForecast.description;
        description.style.textTransform = 'capitalize';
        dayDiv.appendChild(description);

        forecastContainer.appendChild(dayDiv);
    });

    weatherContainer.appendChild(forecastContainer);
}

document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
