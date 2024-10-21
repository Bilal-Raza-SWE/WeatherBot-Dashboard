$(document).ready(function () {
  const weatherApiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11"; // OpenWeatherMap API key
  const geminiApiKey = "AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI"; // Gemini API key

  // Function to handle weather queries using OpenWeather API
  function handleWeatherQuery(city, isForecast = false) {
    const apiUrl = isForecast
      ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (data) {
        if (isForecast) {
          displayWeatherForecastTable(city, data.list);
        } else {
          displayCurrentWeatherTable(city, data);
        }
      },
      error: function () {
        displayChatbotResponse(
          `Sorry, I couldn't fetch the weather data for ${city}.`
        );
      },
    });
  }

  // Function to display current weather in table format
  function displayCurrentWeatherTable(city, data) {
    let tableHtml = `
      <table class="chatbot-table">
        <tbody>
          <tr>
            <th>City</th>
            <td>${city}</td>
          </tr>
          <tr>
            <th>Condition</th>
            <td>${data.weather[0].description}</td>
          </tr>
          <tr>
            <th>Temp (°C)</th>
            <td>${data.main.temp}°C</td>
          </tr>
          <tr>
            <th>Humidity</th>
            <td>${data.main.humidity}%</td>
          </tr>
          <tr>
            <th>Wind Speed</th>
            <td>${data.wind.speed} m/s</td>
          </tr>
        </tbody>
      </table>`;
    displayChatbotResponse(tableHtml, true);
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
    $.ajax({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${query}. Please fetch the weather or forecast or 5-day data from OpenWeather API if relevant, and provide the response with both normal text and emojis.`
              }
            ]
          }
        ]
      }),
      success: function (response) {
        const geminiAnswer =
          (response?.candidates?.[0]?.content?.parts?.[0]?.text) ||
          "Sorry, I don't have an answer for that.";
        
        // Check for weather-related query inside Gemini's response to determine whether to call the weather API
        if (query.toLowerCase().includes("weather") || query.toLowerCase().includes("forecast")) {
          const city = query.split(" ").pop(); // Assuming the last word is the city
          const isForecast = query.toLowerCase().includes("forecast") || query.toLowerCase().includes("5-day");
          handleWeatherQuery(city, isForecast);
        } else {
          displayChatbotResponse(geminiAnswer);
        }
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not find an answer for that question."
        );
      },
    });
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
