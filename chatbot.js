$(document).ready(function () {
  const weatherApiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11"; // Replace with your actual OpenWeatherMap API key
  const geminiApiKey = "AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI";  // Replace with your actual Gemini API key

  // Function to detect weather-related queries
  function isWeatherQuery(query) {
    return (
      query.toLowerCase().includes("weather") ||
      query.toLowerCase().includes("forecast")
    );
  }

  // Function to detect forecast-related queries
  function isForecastQuery(query) {
    return (
      query.toLowerCase().includes("forecast") ||
      query.toLowerCase().includes("5-day")
    );
  }

  // Function to fetch current weather
  function fetchCurrentWeather(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`,
      method: "GET",
      success: function (data) {
        const weather = `Current weather in ${city}: ${data.weather[0].description}, ${data.main.temp}°C. Humidity: ${data.main.humidity}%, Wind speed: ${data.wind.speed} m/s.`;
        displayChatbotResponse(weather);
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not fetch the current weather for that city."
        );
      },
    });
  }

  // Function to fetch 5-day weather forecast
  function fetchWeatherForecast(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`,
      method: "GET",
      success: function (data) {
        const forecast = data.list
          .slice(0, 5)
          .map((entry) => {
            return `Forecast for ${city} at ${entry.dt_txt}: ${entry.weather[0].description}, ${entry.main.temp}°C. Humidity: ${entry.main.humidity}%, Wind speed: ${entry.wind.speed} m/s.`;
          })
          .join("\n");
        displayChatbotResponse(forecast);
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not fetch the weather forecast for that city."
        );
      },
    });
  }

  // Function to display chatbot responses
  function displayChatbotResponse(response) {
    $(".chat-messages").append(
      `<div class="chat-message bot-message">${response}</div>`
    );
  }

  // Event listener for send button
  function sendMessage() {
    const userInput = $("#chat-input").val();
    if (!userInput) return;

    $(".chat-messages").append(
      `<div class="chat-message user-message">${userInput}</div>`
    );
    $("#chat-input").val(""); // Clear the input field

    // Check if the query is weather-related
    if (isWeatherQuery(userInput)) {
      const city = userInput.split(" ").pop(); // Assume the last word is the city

      if (isForecastQuery(userInput)) {
        fetchWeatherForecast(city);
      } else {
        fetchCurrentWeather(city);
      }
    } else {
      // Non-weather-related queries handled by Gemini API
      handleGeneralQuery(userInput);
    }
  }

  $("#send-button").click(sendMessage);
  $("#chat-input").keyup((event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  });

  // Function to handle non-weather-related queries using Gemini API
  function handleGeneralQuery(query) {
    $.ajax({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText?key=${geminiApiKey}`, // Correct Gemini API endpoint
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        prompt: {
          text: query,  // Proper query structure as per Gemini API documentation
        },
      }),
      success: function (response) {
        const geminiAnswer = response?.candidates?.[0]?.output || 'Sorry, I don\'t have an answer for that.';
        displayChatbotResponse(geminiAnswer);
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not find an answer for that question."
        );
      },
    });
  }
});















// AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI
// https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI
// 76ce68845a2e4cfb0d47d6a81c8f7e11