$(document).ready(function () {
  const weatherApiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11"; // OpenWeatherMap API key
  const geminiApiKey = "AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI"; // Gemini API key

  // Function to handle weather queries using OpenWeather API
  function handleWeatherQuery(city, detailType) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;

    $.ajax({
      url: detailType === "forecast" ? forecastWeatherUrl : currentWeatherUrl,
      method: "GET",
      success: function (data) {
        if (detailType === "forecast") {
          displayWeatherForecastTable(city, data.list);
        } else {
          displayCurrentWeatherDetail(city, data, detailType);
        }
      },
      error: function () {
        displayChatbotResponse(
          `Sorry, I couldn't fetch the weather data for ${city}.`
        );
      },
    });
  }

  // Function to display specific current weather detail
  function displayCurrentWeatherDetail(city, data, detailType) {
    let response = "";
    switch (detailType) {
      case "temperature":
        response = `The current temperature in ${city} is ${data.main.temp}°C 🌡️.`;
        break;
      case "condition":
        response = `The current weather condition in ${city} is ${data.weather[0].description} ☁️.`;
        break;
      case "humidity":
        response = `The humidity level in ${city} is ${data.main.humidity}% 💧.`;
        break;
      case "windspeed":
        response = `The wind speed in ${city} is ${data.wind.speed} m/s 💨.`;
        break;
      default:
        response = `The current weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C 🌡️.`;
        break;
    }
    displayChatbotResponse(response);
  }

  // Function to display 5-day weather forecast in table format
  function displayWeatherForecastTable(city, data) {
    let tableHtml = `
      <table class="chatbot-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Temp (°C)</th>
            <th>Condition</th>
            <th>Humidity</th>
            <th>Wind Speed</th>
          </tr>
        </thead>
        <tbody>`;

    data.slice(0, 5).forEach((entry) => {
      const [date, time] = entry.dt_txt.split(" ");
      tableHtml += `
        <tr>
          <td>${date}</td>
          <td>${time}</td>
          <td>${entry.main.temp}°C</td>
          <td>${entry.weather[0].description}</td>
          <td>${entry.main.humidity}%</td>
          <td>${entry.wind.speed} m/s</td>
        </tr>`;
    });

    tableHtml += `</tbody></table>`;
    displayChatbotResponse(tableHtml, true);
  }

  // Function to display chatbot responses
  function displayChatbotResponse(response, isTable = false) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const chatMessage = `
      <div class="chat-message bot-message">
        ${response}
        <div class="timestamp">${timestamp}</div>
      </div>`;

    $(".chat-messages").append(chatMessage);
  }

  // Function to send a user query to Gemini API
  function sendQueryToGemini(query) {
    const city = extractCityFromQuery(query);
    let detailType = "";

    if (query.toLowerCase().includes("temperature")) {
      detailType = "temperature";
    } else if (query.toLowerCase().includes("condition")) {
      detailType = "condition";
    } else if (query.toLowerCase().includes("humidity")) {
      detailType = "humidity";
    } else if (query.toLowerCase().includes("wind speed")) {
      detailType = "windspeed";
    } else if (query.toLowerCase().includes("forecast") || query.toLowerCase().includes("5-day")) {
      detailType = "forecast";
    } else {
      // Default to current weather if not specified
      detailType = "current";
    }

    // Call OpenWeather API based on user input
    if (city) {
      handleWeatherQuery(city, detailType);
    } else {
      // Fallback to Gemini API for general queries
      $.ajax({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${query}. Please provide a response with both normal text and emojis.`
                }
              ]
            }
          ]
        }),
        success: function (response) {
          const geminiAnswer =
            (response?.candidates?.[0]?.content?.parts?.[0]?.text) ||
            "Sorry, I don't have an answer for that.";
          displayChatbotResponse(geminiAnswer);
        },
        error: function () {
          displayChatbotResponse(
            "Sorry, I could not find an answer for that question."
          );
        },
      });
    }
  }

  // Function to extract city name from query
  function extractCityFromQuery(query) {
    const words = query.split(" ");
    return words[words.length - 1]; // Assuming the last word is the city
  }

  // Event listener for sending message
  function sendMessage() {
    const userInput = $("#chat-input").val();
    if (!userInput) return;

    $(".chat-messages").append(
      `<div class="chat-message user-message">${userInput}</div>`
    );
    $("#chat-input").val(""); // Clear the input field

    // Send the query to Gemini for handling weather and other queries
    sendQueryToGemini(userInput);
  }

  $("#send-button").click(sendMessage);
  $("#chat-input").keyup((event) => {
    if (event.keyCode === 13) {
      sendMessage();
    }
  });

  // Add CSS styling for the table
  const style = document.createElement("style");
  style.innerHTML = `
    .chatbot-table {
      width: auto;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 14px;
      text-align: left;
    }
    .chatbot-table th, .chatbot-table td {
      padding: 8px;
      border: 1px solid #ddd;
    }
  `;
  document.head.appendChild(style);
});
