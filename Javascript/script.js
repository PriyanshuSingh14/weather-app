const apiKey = "1c83bbe8cbd53da0c63ca4539f150ff8";

// Function to fetch weather data by city name
function fetchWeatherDataByCityName(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
  fetchWeatherData(apiUrl);
}

// Function to fetch weather data by ZIP code
function fetchWeatherDataByZipCode(zipCode) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;
  fetchWeatherData(apiUrl);
}

// Function to fetch weather data and update the DOM
function fetchWeatherData(apiUrl) {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherDescription = data.weather[0].description;
      const windDirection = data.wind.deg;
      const sunriseTimestamp = data.sys.sunrise;
      const sunsetTimestamp = data.sys.sunset;

      //Function to change the wind direction degree to actual wind direction
      function degreesToCompass(windDirection) {
        const compassDirections = [
          "North",
          "North-Northeast",
          "Northeast",
          "East-Northeast",
          "East",
          "East-Southeast",
          "Southeast",
          "South-Southeast",
          "South",
          "South-Southwest",
          "Southwest",
          "West-Southwest",
          "West",
          "West-Northwest",
          "Northwest",
          "North-Northwest",
        ];

        const index = Math.round((windDirection % 360) / 22.5);
        return compassDirections[index % 16];
      }

      //change timestamp to human readable form
      function timestampToHumanReadable(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = {
          hour: "numeric",
          minute: "numeric",
        };
        const formattedTime = date.toLocaleTimeString(undefined, options);
        return formattedTime;
      }

      //save the data fetched from API to show on the website
      document.getElementById("temperature2").textContent =
        Math.round(((temperature - 273.15) * 9) / 5 + 32) + "°F";
      document.getElementById("temperature1").textContent =
        Math.round(temperature - 273.15) + "°C";
      document.getElementById("humidity").textContent = humidity + "%";
      document.getElementById("windSpeed").textContent = windSpeed + "m/s";
      document.getElementById("weatherDescription").textContent =
        weatherDescription;
      document.getElementById("windDirection").textContent =
        degreesToCompass(windDirection);
      document.getElementById("sunriseTimestamp").textContent =
        timestampToHumanReadable(sunriseTimestamp);
      document.getElementById("sunsetTimestamp").textContent =
        timestampToHumanReadable(sunsetTimestamp);

      //checking data
      console.log("Temperature:", temperature, "K");
      console.log("Humidity:", humidity, "%");
      console.log("Wind Speed:", windSpeed, "m/s");
      console.log("Weather Description:", weatherDescription);
      console.log("Wind Direction:", windDirection, "degrees");
      console.log("Sunrise Timestamp:", sunriseTimestamp);
      console.log("Sunset Timestamp:", sunsetTimestamp);

      const selectedUnit = tempToggle.value;
      updateTemperatureDisplay(selectedUnit);

      const locationInput = document.getElementById("locationInput").value;
      const displayArea = document.getElementById("displayArea");
      displayArea.innerHTML = locationInput || "London";

      document.getElementById("locationInput").value = "";
    })
    .catch((error) => {

      console.error("Error fetching weather data:", error);
      alert("There was an error while fetching weather .Check if you have entered a right city name.");
      document.getElementById("locationInput").value = "";
    });
}

// Function to check if input is a number
function isNumberInput(input) {
  return !isNaN(input);
}

// Function to update temperature based on the selected unit (Celsius or Fahrenheit)
function updateTemperatureDisplay(unit) {
  const temp1Element = document.getElementById("temperature1");
  const temp2Element = document.getElementById("temperature2");

  if (unit === "C") {
    temp1Element.style.display = "inline-block";
    temp2Element.style.display = "none";
  } else {
    temp1Element.style.display = "none";
    temp2Element.style.display = "inline-block";
  }
}

// Default fetch for London when the page loads
fetchWeatherDataByCityName("London");

const locationInput = document.getElementById("locationInput");
const tempToggle = document.getElementById("tempToggle");

locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const location = locationInput.value.trim();
    if (isNumberInput(location)) {
      fetchWeatherDataByZipCode(location);
      alert("Weather fetching using zip codes is only available for the cities of USA.")
    } else {
      fetchWeatherDataByCityName(location);
    }
  }
});

const searchButton = document.getElementById("getWeatherButton");
searchButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (isNumberInput(location)) {
    fetchWeatherDataByZipCode(location);
  } else {
    fetchWeatherDataByCityName(location);
  }
});

// Event listener for temperature unit toggle change
tempToggle.addEventListener("change", (event) => {
  const selectedUnit = event.target.value;
  updateTemperatureDisplay(selectedUnit);
});
