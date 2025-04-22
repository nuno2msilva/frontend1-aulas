// Waits until HTML is all loaded up to run the weather widget
document.addEventListener('DOMContentLoaded', function() {
    
      // Function to turn text into Title Case
    function toTitleCase(text) {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    }

    // API key configuration
    const apiKey = '4f9bb43e2684b8c44b302808565747ec';
    
    // Sets default city to "Faro"
    const defaultCity = "Faro";
    
    // DOM Elements
    const cityInput = document.getElementById("city-input");
    const searchForm = document.querySelector(".search-form");
    const statusBar = document.getElementById("status-bar");
    const regionName = document.querySelector(".region-name");
    const weatherIcon = document.getElementById("weather-icon");
    const currentTemp = document.getElementById("current-temp");
    const weatherDetails = document.querySelector(".weather-details");
    const forecastGrid = document.querySelector(".forecast-grid");
    
    // Updates the status bar with success or error messages
    function setStatus(isSuccess, message) {
        // Clear existing classes and set the appropriate one
        if (isSuccess) {
            statusBar.className = "status-success";
        } else {
            statusBar.className = "status-error";
        }
        
        // Update the status message
        statusBar.textContent = message;
    }
    
    // Fetches weather data from OpenWeather API
    async function fetchWeatherData(city) {
        try {
            setStatus(true, "Fetching Weather Data...");
            
            // Fetch current weather for default region "Faro"
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const currentResponse = await fetch(currentWeatherUrl);
            
            // Handle errors from API
            if (!currentResponse.ok) {
                if (currentResponse.status === 404) {
                    throw new Error('Region not found!');
                } else {
                    throw new Error('Weather Service Temporarily Unavailable!');
                }
            }
            const currentData = await currentResponse.json();
            
            // Fetch forecast data for specified region
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            
            // Display Weather data
            displayCurrentWeather(currentData);
            displayForecast(forecastData);
            
            // Update status to show success
            setStatus(true, "Weather Service Online and Ready!");
            
        } catch (error) {
            console.error('Error:', error);
            setStatus(false, error.message);
            clearWeatherData();
        }
    }
    
    // Displays the current weather data
    function displayCurrentWeather(data) {
        // Make sure icon and temperature are visible
        weatherIcon.style.display = 'block';
        currentTemp.style.display = 'block';
        
        // Set region name
        regionName.textContent = `${data.name} Region`;
        
        // Set weather icon and temperature
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        
        // Build weather details HTML
        const detailsHTML = `
            <div class="weather-detail">
                <div class="detail-label">Description</div>
                ${toTitleCase(data.weather[0].description)}
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
        
        // Update the details section
        weatherDetails.innerHTML = detailsHTML;
    }
    
    // Formats Unix Timestamp to HH:MM format

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    /**
     * Creates a simulated hourly forecast display
     */
    function displayForecast(data) {
        // Clear previous forecast data
        forecastGrid.innerHTML = '';
        
        // Get current hour for reference
        const now = new Date();
        const currentHour = now.getHours();
        
        // Store available forecast data by hour
        const forecastsByHour = {};
        
        // Process API forecast data (first 5 entries)
        data.list.slice(0, 5).forEach(item => {
            const itemDate = new Date(item.dt * 1000);
            const hour = itemDate.getHours();
            forecastsByHour[hour] = item;
        });
        
        // Base forecast for interpolation
        const baseForecast = data.list[0];
        
        // Generate 12 hourly forecasts
        for (let i = 0; i < 12; i++) {
            // Calculate hour (0-23) for this forecast
            const forecastHour = (currentHour + i) % 24;
            const formattedHour = forecastHour.toString().padStart(2, '0');
            
            // Temperature adjustment based on time of day
            let tempAdjustment = 0;
            
            // Apply temperature curve based on time of day
            if (forecastHour >= 6 && forecastHour <= 12) {
                // Morning: warming up
                tempAdjustment = (forecastHour - 6) * 0.5;
            } else if (forecastHour >= 13 && forecastHour <= 18) {
                // Afternoon: cooling down
                tempAdjustment = (18 - forecastHour) * 0.3;
            } else {
                // Evening/night: cooler
                tempAdjustment = -1;
            }
            
            // Use real API data if available for this hour, otherwise use base forecast
            let itemToUse = baseForecast;
            if (forecastsByHour[forecastHour]) {
                itemToUse = forecastsByHour[forecastHour];
            }
            
            // Get icon and handle day/night variations
            let iconCode = itemToUse.weather[0].icon;
            
            // Use night icons during night hours
            if (forecastHour >= 19 || forecastHour <= 5) {
                iconCode = iconCode.replace('d', 'n');
            }
            
            // Calculate temperatures with some variation
            const baseTemp = itemToUse.main.temp;
            const adjustedTemp = baseTemp + tempAdjustment;
            const minTemp = adjustedTemp - (Math.random() * 2);
            const maxTemp = adjustedTemp + (Math.random() * 2);
            
            // Create forecast item element
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            // Build forecast item content
            forecastItem.innerHTML = `
                <div class="forecast-time">${formattedHour}:00</div>
                <img class="forecast-icon" 
                     src="https://openweathermap.org/img/wn/${iconCode}.png" 
                     alt="${itemToUse.weather[0].description}">
                <div class="forecast-temp">
                    <span class="max-temp">${Math.round(maxTemp)}°</span>
                    /
                    <span class="min-temp">${Math.round(minTemp)}°</span>
                </div>
            `;
            
            // Add to the forecast grid
            forecastGrid.appendChild(forecastItem);
        }
    }
    
    /**
     * Clears weather data and shows error messages
     */
    function clearWeatherData() {
        // Clear region name
        regionName.textContent = '';
        
        // Hide weather elements
        weatherIcon.style.display = 'none';
        currentTemp.style.display = 'none';
        
        // Clear values for accessibility
        weatherIcon.src = '';
        weatherIcon.alt = '';
        currentTemp.textContent = '';
        
        // Show error messages
        regionName.innerHTML = '<div class="region-error">REGION DATA ERROR</div>';
        weatherDetails.innerHTML = '<div class="weather-error">WEATHER<br> DATA ERROR</div>';
        forecastGrid.innerHTML = '<div class="forecast-error">FORECAST<br> DATA ERRROR</div>';
    }1
    
    // Set up event listener for search form
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const city = cityInput.value.trim();
        
        if (city) {
            fetchWeatherData(city);
        } else {
            setStatus(false, "Please enter a city name");
        }
    });
    
    // Initial load with default city
    fetchWeatherData(defaultCity);
});