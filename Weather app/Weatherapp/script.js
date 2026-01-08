async function fetchWeatherData(city) {
    const apiKey = "914bfeb7b6cb8e3391743df1fedfa649";  

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); 

        
        if (data.cod != 200) {
            alert("City not found! Please enter a valid city name.");
            return;
        }

        
        const date = new Date(data.dt * 1000);
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

       
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        document.getElementById("status").innerHTML = `
            <strong>City: ${data.name}</strong> <br><br>
            <b>Day and Date:</b> ${formattedDate} <br><br>
            <b>Main Weather Condition:</b> ${data.weather[0].main} <br><br>
            <b>Weather Condition:</b> ${data.weather[0].description} <br><br>
            <img src="${icon}" alt="Weather Icon"><br><br>
            <strong class="temperature">${data.main.temp} °C </strong> <br><br>
            <div class="weather-details">
                <div class="label">Pressure:</div>
                <div class="value">${data.main.pressure} hPa</div>
            </div>
            <div class="weather-details">
                <div class="label">Humidity:</div>
                <div class="value">${data.main.humidity}%</div>
            </div>
            <div class="weather-details">
                <div class="label">Wind Speed:</div>
                <div class="value">${data.wind.speed} m/s</div>
            </div>
            <div class="weather-details">
                <div class="label">Wind Direction:</div>
                <div class="value">${data.wind.deg}°</div>
            </div>
         `;
    } catch (error) {
        console.log("Error fetching data:", error);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData("Kathmandu");  
});



document.getElementById("searchButton").addEventListener("click", () => {
    const city = document.getElementById("searchInput").value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});
