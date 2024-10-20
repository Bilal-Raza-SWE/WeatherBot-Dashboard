# WeatherBot-Dashboard
🌦️ Weather Dashboard with Chatbot Integration 🌤️
==================================================

Welcome to the **Weather Dashboard**! This project combines the power of weather data visualization with an interactive chatbot to enhance your weather-checking experience.

📖 Table of Contents
--------------------

*   [✨ Features](#-features)
    
*   [🛠️ Technologies Used](#-technologies-used)
    
*   [🔧 Setup Instructions](#-setup-instructions)
    
*   [📁 Project Structure](#-project-structure)
    
*   [📊 Screenshots](#-screenshots)
    
*   [💡 Challenges & Solutions](#-challenges--solutions)
    
*   [🔗 License](#-license)
    

✨ Features
----------

*   **Real-Time Weather Data**: Get accurate weather updates for your selected cities.
    
*   **Interactive Charts**: Visualize temperature trends, weather conditions, and more with Chart.js.
    
*   **Chatbot Integration**: Ask general questions or request weather updates with the integrated Gemini Chatbot.
    
*   **Dynamic Tables**: View 5-day weather forecasts in a user-friendly table format with pagination.
    

🛠️ Technologies Used
---------------------

*   **Frontend**: HTML, CSS, JavaScript, jQuery
    
*   **APIs**: OpenWeather API for weather data, Gemini API for chatbot functionality
    
*   **Data Visualization**: Chart.js for charting weather data
    
*   **Storage**: Chrome Storage API for temporary data retention
    

🔧 Setup Instructions
---------------------

To get started with the Weather Dashboard, follow these steps:

1.  bashCopy codegit clone https://github.com/yourusername/weather-dashboard.gitcd weather-dashboard
    
2.  **Open the Project**:Open index.html in your favorite browser.
    
3.  **Firebase Deployment** (Optional):If you want to deploy on Firebase, follow these instructions.
    

📁 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   bashCopy code/weather-dashboard  │  ├── index.html      # Main dashboard page  ├── styles.css      # CSS for styling  ├── script.js       # JavaScript functionality  ├── Table.js        # JavaScript for table functionality  └── README.md       # Project documentation   `

📊 Screenshots
--------------

_Example of the Weather Dashboard Interface_

_Sample of the Forecast Data Table_

💡 Challenges & Solutions
-------------------------

*   **Challenge**: Handling asynchronous API calls.
    
    *   **Solution**: Utilized Promises and async/await to manage data fetching efficiently.
        
*   **Challenge**: Ensuring data retention while navigating pages.
    
    *   **Solution**: Implemented Chrome Storage API to store search history temporarily.
        

🔗 License
----------

This project is licensed under the MIT License. See the LICENSE file for more information.