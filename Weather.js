$(document).ready(function () {
  const apiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11";

  // Search button click event
  function SearchButton() {
    const city = $("#city-input").val().toLowerCase().trim();
    if (city) {
      fetchWeatherData(city);  // Fetch current weather data
      fetchForecastData(city); // Fetch 5-day forecast data
    } else {
      alert("Please enter a city name");
    }
  }

  $("#search-button").on("click", SearchButton);

  $("#city-input").on("keypress", function (e) {
    if (e.which === 13) { 
      SearchButton();
    }
  });

  // Fetch current weather data from OpenWeather API
  function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    $.get(url, function (data) {
      displayCurrentWeather(data);
    }).fail(function () {
      alert("City not found or API error");
    });
  }

  // Display current weather data in the dashboard
function displayCurrentWeather(data) {
  const { name, weather, main, wind } = data;
  const weatherHtml = `
    <h3>${name}</h3>
    <p><strong>Condition:</strong> ${weather[0].description}</p>
    <p><strong>Temperature:</strong> <span id="temperature">${main.temp}°C</span> 
    <button id="toggle-temp" style="margin-left: 10px;">Toggle °F</button></p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
    <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon">
  `;
  $("#current-weather").show();
  $("#current-weather").html(weatherHtml);

  // Toggle temperature unit on button click
  $("#toggle-temp").on("click", function () {
    const tempCelsius = main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    const currentUnit = $("#temperature").text().includes("°C") ? "C" : "F";

    if (currentUnit === "C") {
      $("#temperature").text(`${tempFahrenheit.toFixed(1)}°F`);
      $(this).text("Toggle °C");
    } else {
      $("#temperature").text(`${tempCelsius}°C`);
      $(this).text("Toggle °F");
    }
  });
}


  // Fetch 5-day forecast data
  function fetchForecastData(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    $.get(forecastUrl, function (forecastData) {
      updateForecastCharts(forecastData);
    }).fail(function () {
      alert("Failed to fetch 5-day forecast");
    });
  }

  // Update charts with 5-day forecast data
  function updateForecastCharts(forecastData) {
    const dailyTemps = [];
    const weatherConditions = {};
    const labels = [];
    
    // Extract data for the next 5 days
    forecastData.list.forEach((item, index) => {
      if (index % 8 === 0) { // Every 8th item represents a new day
        const temp = item.main.temp;
        const weatherDesc = item.weather[0].main;
        const date = new Date(item.dt * 1000).toLocaleDateString();
        
        dailyTemps.push(temp);
        labels.push(date);

        if (weatherConditions[weatherDesc]) {
          weatherConditions[weatherDesc]++;
        } else {
          weatherConditions[weatherDesc] = 1;
        }
      }
    });

    // Bar Chart: Temperatures for the next 5 days
    const barCtx = $("#barChart")[0].getContext("2d");
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "5-Day Temperature",
          data: dailyTemps,
          backgroundColor: "#3498db"
        }]
      }
    });

    // Doughnut Chart: Percentage of different weather conditions
    const doughnutCtx = $("#doughnutChart")[0].getContext("2d");
    new Chart(doughnutCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(weatherConditions),
        datasets: [{
          data: Object.values(weatherConditions),
          backgroundColor: ["#3498db", "#1abc9c", "#e74c3c", "#f1c40f"]
        }]
      }
    });

    // Line Chart: Temperature changes over the next 5 days
    const lineCtx = $("#lineChart")[0].getContext("2d");
    new Chart(lineCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Temperature",
          data: dailyTemps,
          backgroundColor: "#3498db",
          borderColor: "#2980b9",
          fill: false
        }]
      }
    });
  }
});
