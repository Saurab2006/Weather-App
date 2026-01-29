async function fetchWeatherData(city) {
    let data;
    
    // Step 1: Check if browser is online or offline
    if (navigator.onLine) {
        // Step 2: Browser is online - fetch from API
        const url = `http://localhost/Prototype%202/weatherapp/connection.php?q=${city}`;

        try {
            const response = await fetch(url);
            data = await response.json();

            if (data.error) {
                alert("City not found! Please enter a valid city name.");
                return;
            }

            // Step 3: Save data to localStorage
            localStorage.setItem(city, JSON.stringify(data));
            
            // Step 5 & 6: Display the weather data
            displayWeatherData(data);
            
        } catch (error) {
            console.log("Error fetching data:", error);
            
            // If fetch fails, try to load from localStorage
            const cachedData = localStorage.getItem(city);
            if (cachedData) {
                data = JSON.parse(cachedData);
                displayWeatherData(data);
                alert("Connection error. Showing cached data.");
            } else {
                alert("Error connecting to server and no cached data available.");
            }
        }
    } else {
        // Step 4: Browser is offline - retrieve from localStorage
        const cachedData = localStorage.getItem(city);
        
        if (cachedData) {
            data = JSON.parse(cachedData);
            displayWeatherData(data);
            alert("You are offline. Showing cached data.");
        } else {
            alert("You are offline and no cached data is available for this city.");
        }
    }
}

// Step 5 & 6: Function to display weather data on webpage
function displayWeatherData(data) {
    const weatherData = data[0];

    const icon = `https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`;

    document.getElementById("status").innerHTML = `
        <strong>City: ${weatherData.city}</strong> <br><br>
        <b>Day and Date:</b> ${weatherData.date_formatted} <br><br>
        <b>Main Weather Condition:</b> ${weatherData.weather_condition} <br><br>
        <b>Weather Condition:</b> ${weatherData.description} <br><br>
        <img src="${icon}" alt="Weather Icon"><br><br>
        <strong class="temperature">${weatherData.temperature} °C </strong> <br><br>
        <div class="weather-details">
            <div class="label">Pressure:</div>
            <div class="value">${weatherData.pressure} hPa</div>
        </div>
        <div class="weather-details">
            <div class="label">Humidity:</div>
            <div class="value">${weatherData.humidity}%</div>
        </div>
        <div class="weather-details">
            <div class="label">Wind Speed:</div>
            <div class="value">${weatherData.wind_speed} m/s</div>
        </div>
        <div class="weather-details">
            <div class="label">Wind Direction:</div>
            <div class="value">${weatherData.wind_direction}°</div>
        </div>
        ${weatherData.hours_old > 0 ? `<br><div style="background: #fff3cd; padding: 10px; border-radius: 8px; margin-top: 10px;">Data is ${weatherData.hours_old} hour(s) old</div>` : ''}
    `;
}

window.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData("Bolton");
});

document.getElementById("searchButton").addEventListener("click", () => {
    const city = document.getElementById("searchInput").value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});