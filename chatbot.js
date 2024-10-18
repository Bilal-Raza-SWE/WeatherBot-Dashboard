$(document).ready(function () {
  const weatherApiKey = "76ce68845a2e4cfb0d47d6a81c8f7e11"; // Replace with your actual OpenWeatherMap API key
  const geminiApiKey = "AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI"; // Replace with your actual Gemini API key

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
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not fetch the current weather for that city."
        );
      },
    });
  }

  // Add CSS styling for the table
  const style = document.createElement('style');
  style.innerHTML = `
    .chatbot-table {
      width: auto; !important
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

  // Function to fetch 5-day weather forecast
  function fetchWeatherForecast(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`,
      method: "GET",
      success: function (data) {
        displayWeatherForecastTable(city, data.list);
      },
      error: function () {
        displayChatbotResponse(
          "Sorry, I could not fetch the weather forecast for that city."
        );
      },
    });
  }

  // Function to display chatbot responses
  function displayChatbotResponse(response, isTable = false) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    let chatMessage = `<div class="chat-message bot-message">
                        ${response}
                          <div class="timestamp">
                            ${timestamp}
                          </div>
                        </div>`;

    if (isTable) {
      $(".chat-messages").append(chatMessage);
    } else {
      $(".chat-messages").append(chatMessage);
    }
  }

  // Function to display weather forecast in table format
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
      <tbody>
  `;

    data.slice(0, 5).forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      const time = entry.dt_txt.split(" ")[1];
      tableHtml += `
      <tr>
        <td>${date}</td>
        <td>${time}</td>
        <td>${entry.main.temp}°C</td>
        <td>${entry.weather[0].description}</td>
        <td>${entry.main.humidity}%</td>
        <td>${entry.wind.speed} m/s</td>
      </tr>
    `;
    });
    tableHtml += `</tbody></table>`;
    displayChatbotResponse(tableHtml, true);
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
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, // Correct Gemini API endpoint
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        prompt: {
          text: query, // Proper query structure as per Gemini API documentation
        },
      }),
      success: function (response) {
        const geminiAnswer =
          response?.candidates?.[0]?.output ||
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
});

// AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI
// https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCSRfPizXNy1ifW48oR_ieJTYHOBEcGWAI
// 76ce68845a2e4cfb0d47d6a81c8f7e11
