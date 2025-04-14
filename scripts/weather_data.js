document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '4f9bb43e2684b8c44b302808565747ec';
    const defaultCity = 'Faro';
    
    const cityInput = document.getElementById('city-input');
    const searchForm = document.querySelector('.search-form');
    const statusBar = document.getElementById('status-bar');
    const regionName = document.querySelector('.region-name');
    const weatherIcon = document.getElementById('weather-icon');
    const currentTemp = document.getElementById('current-temp');
    const weatherDetails = document.querySelector('.weather-details');
    const forecastGrid = document.querySelector('.forecast-grid');
    
    function setStatus(isSuccess, message) {
        statusBar.className = isSuccess ? 'status-bar status-success' : 'status-bar status-error';
        statusBar.textContent = message;
    }
    
    async function fetchWeatherData(city) {
        try {
            setStatus(true, "Loading weather data...");
            
            // Fetch current weather
            const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            
            if (!currentResponse.ok) {
                if (currentResponse.status === 404) {
                    throw new Error('City not found');
                } else {
                    throw new Error('Weather service unavailable');
                }
            }
            
            const currentData = await currentResponse.json();
            
            // Fetch forecast
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            
            // Display data
            displayCurrentWeather(currentData);
            displayForecast(forecastData);
            
            setStatus(true, "Weather data loaded");
            
        } catch (error) {
            console.error('Error:', error);
            setStatus(false, error.message);
            clearWeatherData();
        }
    }
    
    function displayCurrentWeather(data) {
        // Ensure icons and temperature are visible when data is shown
        weatherIcon.style.display = '';
        currentTemp.style.display = '';
        
        // Set region name
        regionName.textContent = `${data.name} Region`;
        
        // Set weather icon and temperature
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        
        // Enhanced weather details with more information
        weatherDetails.innerHTML = `
            <div class="weather-detail">
                <div class="detail-label">Description</div>
                ${data.weather[0].description}
            </div>
            <div class="weather-detail">
                <div class="detail-label">Feels Like</div>
                ${Math.round(data.main.feels_like)}°C
            </div>
            <div class="weather-detail">
                <div class="detail-label">Min/Max</div>
                ${Math.round(data.main.temp_min)}°/${Math.round(data.main.temp_max)}°C
            </div>
            <div class="weather-detail">
                <div class="detail-label">Humidity</div>
                ${data.main.humidity}%
            </div>
            <div class="weather-detail">
                <div class="detail-label">Wind</div>
                ${(data.wind.speed * 3.6).toFixed(1)} km/h
            </div>
            <div class="weather-detail">
                <div class="detail-label">Pressure</div>
                ${data.main.pressure} hPa
            </div>
            <div class="weather-detail">
                <div class="detail-label">Visibility</div>
                ${(data.visibility / 1000).toFixed(1)} km
            </div>
            <div class="weather-detail">
                <div class="detail-label">Sunrise/Sunset</div>
                ${formatTime(data.sys.sunrise)}/${formatTime(data.sys.sunset)}
            </div>
        `;
    }
    
    // Helper function to format timestamp to HH:MM
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.getHours().toString().padStart(2, '0') + ':' + 
               date.getMinutes().toString().padStart(2, '0');
    }
    
    function displayForecast(data) {
        forecastGrid.innerHTML = '';
        
        // Display next 12 forecast items (3-hour intervals)
        for (let i = 0; i < 12 && i < data.list.length; i++) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000);
            const hour = date.getHours().toString().padStart(2, '0');
            const iconCode = forecast.weather[0].icon;
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-time">${hour}:00</div>
                <img class="forecast-icon" src="https://openweathermap.org/img/wn/${iconCode}.png" 
                     alt="${forecast.weather[0].description}">
                <div class="forecast-temp">
                    <span class="max-temp">${Math.round(forecast.main.temp_max)}°</span>
                    /
                    <span class="min-temp">${Math.round(forecast.main.temp_min)}°</span>
                </div>
            `;
            
            forecastGrid.appendChild(forecastItem);
        }
    }
    
    function clearWeatherData() {
        // Clear current weather
        regionName.textContent = '';
        
        // Hide the weather icon and temperature completely
        weatherIcon.style.display = 'none';
        currentTemp.style.display = 'none';
        
        // Clear their values as well (for accessibility)
        weatherIcon.src = '';
        weatherIcon.alt = '';
        currentTemp.textContent = '';
        
        // Show error message in weather details
        weatherDetails.innerHTML = '<div class="weather-error">No data available</div>';
        
        // Clear forecast grid with centered error message
        forecastGrid.innerHTML = '<div class="forecast-error">No data available</div>';
    }
    
    // Event listener for search form
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            setStatus(false, "Please enter a city name");
        }
    });
    
    // Load default city on page load
    fetchWeatherData(defaultCity);
});