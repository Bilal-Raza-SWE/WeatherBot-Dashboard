$(document).ready(function () {
  const weatherData = JSON.parse(sessionStorage.getItem("weatherData"));

  if (weatherData) {
    const forecastList = weatherData.forecast;
    const city = weatherData.city;

    const entriesPerPage = 10;
    let currentPage = 1;

    function renderTable(page) {
      const startIndex = (page - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      const paginatedData = forecastList.slice(startIndex, endIndex);

      $("#forecast-table-body").empty();

      paginatedData.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        const time = entry.dt_txt.split(" ")[1].slice(0, 5);
        const temp = entry.main.temp.toFixed(1);
        const condition = entry.weather[0].description;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.speed;

        const tableRow = `
                    <tr>
                        <td class="date-column">${date}</td>
                        <td class="time-column">${time}</td>
                        <td class="city-column">${city}</td>
                        <td class="temp-column">
                            <span class="temperature-display">${temp}</span>
                            <span class="temperature-unit">°C</span>
                        </td>
                        <td class="condition-column">${condition}</td>
                        <td class="humidity-column">${humidity}</td>
                        <td class="wind-column">${windSpeed} m/s</td>
                    </tr>
                `;

        $("#forecast-table-body").append(tableRow);
      });

      updatePaginationButtons();
    }

    function updatePaginationButtons() {
      const totalPages = Math.ceil(forecastList.length / entriesPerPage);

      if (currentPage === 1) {
        $(".btn-prev").addClass("disabled");
      } else {
        $(".btn-prev").removeClass("disabled");
      }

      if (currentPage === totalPages) {
        $(".btn-next").addClass("disabled");
      } else {
        $(".btn-next").removeClass("disabled");
      }
    }

    function sortByTemperature(order) {
      forecastList.sort((a, b) => {
        const tempA = a.main.temp;
        const tempB = b.main.temp;
        return order === 'asc' ? tempA - tempB : tempB - tempA;
      });
      renderTable(currentPage);
    }

    function filterRainyDays() {
      const rainyDays = forecastList.filter(entry => {
        return entry.weather[0].main.toLowerCase() === 'rain';
      });
      renderFilteredTable(rainyDays);
    }

    function renderFilteredTable(data) {
      currentPage = 1; // Reset to first page
      $("#forecast-table-body").empty();

      const totalEntries = data.length;
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      paginatedData.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        const time = entry.dt_txt.split(" ")[1].slice(0, 5);
        const temp = entry.main.temp.toFixed(1);
        const condition = entry.weather[0].description;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.speed;

        const tableRow = `
                    <tr>
                        <td class="date-column">${date}</td>
                        <td class="time-column">${time}</td>
                        <td class="city-column">${city}</td>
                        <td class="temp-column">
                            <span class="temperature-display">${temp}</span>
                            <span class="temperature-unit">°C</span>
                        </td>
                        <td class="condition-column">${condition}</td>
                        <td class="humidity-column">${humidity}</td>
                        <td class="wind-column">${windSpeed} m/s</td>
                    </tr>
                `;

        $("#forecast-table-body").append(tableRow);
      });

      updatePaginationButtons();
    }

    renderTable(currentPage);

    // Pagination logic
    $(".btn-next").on("click", function () {
      const totalPages = Math.ceil(forecastList.length / entriesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable(currentPage);
      }
    });

    $(".btn-prev").on("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderTable(currentPage);
      }
    });

    // Event handlers for filter buttons
    $(".filter-buttons .btn").eq(0).on("click", function () {
      sortByTemperature('asc');
    });

    $(".filter-buttons .btn").eq(1).on("click", function () {
      sortByTemperature('desc');
    });

    $(".filter-buttons .btn").eq(2).on("click", function () {
      filterRainyDays();
    });

    $(".filter-buttons .btn").eq(3).on("click", function () {
      const highestTemp = Math.max(...forecastList.map(entry => entry.main.temp));
      const hottestDays = forecastList.filter(entry => entry.main.temp === highestTemp);
      renderFilteredTable(hottestDays);
    });
  } else {
    console.error("No weather data found in sessionStorage or forecast is missing.");
  }
});
