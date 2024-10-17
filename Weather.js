$(document).ready(function () {
  const apiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11";
  let barChartInstance, doughnutChartInstance, lineChartInstance;

  // Check if there is already stored current weather data
  const storedCurrentWeatherData = JSON.parse(localStorage.getItem("currentWeatherData"));
  if (storedCurrentWeatherData) {
    displayCurrentWeather(storedCurrentWeatherData); // Use stored data to display weather
  }

  // Search button click event
  function SearchButton() {
    const city = $("#city-input").val().toLowerCase().trim();
    if (city) {
      fetchWeatherData(city); // Fetch current weather data
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

      // Ensure to store the current weather as well
      storeWeatherDataInLocalStorage(city, data);
    }).fail(function () {
      alert("City not found or API error");
    });
  }

  // Display current weather data in the dashboard
  function displayCurrentWeather(data) {
    const { name, weather, main, wind } = data;
    const weatherCondition = weather[0].main; // Get the main weather condition
    const weatherWidget = $("#current-weather"); // Your weather widget/container

    // Store current weather data in localStorage
    localStorage.setItem("currentWeatherData", JSON.stringify(data));

    // Set the background gradient based on weather condition
    weatherWidget.removeClass(); // Remove previous background class

    switch (weatherCondition) {
      case "Clear":
        weatherWidget.addClass("gradient-clear-sky");
        break;
      case "Clouds":
        weatherWidget.addClass("gradient-clouds");
        break;
      case "Rain":
        weatherWidget.addClass("gradient-rain");
        break;
      case "Snow":
        weatherWidget.addClass("gradient-snow");
        break;
      case "Thunderstorm":
        weatherWidget.addClass("gradient-thunderstorm");
        break;
      case "Drizzle":
        weatherWidget.addClass("gradient-drizzle");
        break;
      case "Mist":
        weatherWidget.addClass("gradient-mist");
        break;
      default:
        weatherWidget.addClass("gradient-clear-sky"); // Default to clear sky gradient
    }

    const weatherHtml = `
      <h3>${name}</h3>
      <p><strong>Condition:</strong> ${weather[0].description}</p>
      <p><strong>Temperature:</strong> <span id="temperature">${main.temp}°C</span> 
      <button id="toggle-temp" style="margin-left: 10px;">Toggle °F</button></p>
      <p><strong>Humidity:</strong> ${main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
      <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon">
    `;

    weatherWidget.show();
    weatherWidget.html(weatherHtml);

    // Toggle temperature unit on button click
    $("#toggle-temp").on("click", function () {
      const tempCelsius = main.temp;
      const tempFahrenheit = (tempCelsius * 9) / 5 + 32;
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

      // Store 5-day forecast data in localStorage
      storeWeatherDataInLocalStorage(city, forecastData.list);
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
      if (index % 8 === 0) {
        // Every 8th item represents a new day
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

    // Destroy previous chart instances if they exist
    if (barChartInstance) barChartInstance.destroy();
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    // Create gradients
    const barCtx = $("#barChart")[0].getContext("2d");
    const doughnutCtx = $("#doughnutChart")[0].getContext("2d");
    const lineCtx = $("#lineChart")[0].getContext("2d");

    const clearSkyGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    clearSkyGradient.addColorStop(0, "#56CCF2");
    clearSkyGradient.addColorStop(1, "#2F80ED");

    const cloudsGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    cloudsGradient.addColorStop(0, "#BBD2C5");
    cloudsGradient.addColorStop(1, "#536976");

    const rainGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    rainGradient.addColorStop(0, "#ff75c3");
    rainGradient.addColorStop(0.2, "#ffa647");
    rainGradient.addColorStop(0.4, "#ffe83f");
    rainGradient.addColorStop(0.6, "#9fff5b");
    rainGradient.addColorStop(0.8, "#70e2ff");
    rainGradient.addColorStop(1, "#cd93ff");

    const snowGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    snowGradient.addColorStop(0, "#ffffff");
    snowGradient.addColorStop(1, "#e6e6e6");

    const thunderstormGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    thunderstormGradient.addColorStop(0, "#434343");
    thunderstormGradient.addColorStop(1, "#000000");

    const drizzleGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    drizzleGradient.addColorStop(0, "#F7941E");
    drizzleGradient.addColorStop(1, "#004E8F");

    const mistGradient = barCtx.createLinearGradient(0, 0, 0, 400);
    mistGradient.addColorStop(0, "#215f00");
    mistGradient.addColorStop(1, "#e4e4d9");

    // Bar Chart: Temperatures for the next 5 days
    barChartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "5-Day Temperature",
            data: dailyTemps,
            backgroundColor: function (context) {
              const weatherCondition =
                forecastData.list[context.dataIndex * 8].weather[0].main;
              switch (weatherCondition) {
                case "Clear":
                  return clearSkyGradient;
                case "Clouds":
                  return cloudsGradient;
                case "Rain":
                  return rainGradient;
                case "Snow":
                  return snowGradient;
                case "Thunderstorm":
                  return thunderstormGradient;
                case "Drizzle":
                  return drizzleGradient;
                case "Mist":
                  return mistGradient;
                default:
                  return clearSkyGradient; // Default to clear sky gradient
              }
            },
          },
        ],
      },
    });

    // Doughnut Chart: Percentage of different weather conditions
    doughnutChartInstance = new Chart(doughnutCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(weatherConditions),
        datasets: [
          {
            data: Object.values(weatherConditions),
            backgroundColor: function (context) {
              const weatherCondition =
                Object.keys(weatherConditions)[context.dataIndex]; // Correcting weather condition reference
              switch (weatherCondition) {
                case "Clear":
                  return clearSkyGradient;
                case "Clouds":
                  return cloudsGradient;
                case "Rain":
                  return rainGradient;
                case "Snow":
                  return snowGradient;
                case "Thunderstorm":
                  return thunderstormGradient;
                case "Drizzle":
                  return drizzleGradient;
                case "Mist":
                  return mistGradient;
                default:
                  return clearSkyGradient; // Default to clear sky gradient
              }
            },
          },
        ],
      },
    });

    // Line Chart: Temperature changes over the next 5 days
    lineChartInstance = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            data: dailyTemps,
            backgroundColor: clearSkyGradient, // You can apply different gradients as needed
            borderColor: "#2980b9", // Keep a solid color for the line
            fill: true,
          },
        ],
      },
    });
  }

  // Function to store weather data in localStorage
function storeWeatherDataInLocalStorage(city, forecastData) {
  const existingData = JSON.parse(localStorage.getItem('weatherData')) || {};
  
  const weatherData = {
      city: city,
      forecast: forecastData, // Update the forecast data
      timestamp: new Date().getTime() // Optional: Store the time for potential future use
  };

  localStorage.setItem('weatherData', JSON.stringify(weatherData));
}
});