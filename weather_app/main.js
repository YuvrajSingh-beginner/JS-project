const apiKey = "fc7899518a9aa1ad66474259ceb5a478n";
// ========== WEATHER MAIN INFO ==========
const cityNameEl = document.querySelector(".city-name");   // City name
const mainTempEl = document.querySelector(".main-temp");   // Current temp
const weatherDesEl = document.querySelector(".weather-des"); // Weather description
const minTempEl = document.querySelector(".min-temp");     // Min temp
const maxTempEl = document.querySelector(".max-temp");     // Max temp

// ========== AIR QUALITY ==========
const airIndexEl = document.querySelector(".air-index");   // AQI value
const airDesEl = document.querySelector(".air-des");       // AQI short label
const airDes2El = document.querySelector(".air-des2");     // AQI description

// ========== WEATHER DETAILS ==========
const cloudEl = document.querySelector(".cloud");          // Cloud %
const cloudDesEl = document.querySelector(".cloud-des");   // Cloud text
const feelsLikeEl = document.querySelector(".feels-like"); // Feels like temp
const humidityEl = document.querySelector(".humidity");    // Humidity %
const windEl = document.querySelector(".wind");            // Wind speed
const airPressureEl = document.querySelector(".air-pressure"); // Air pressure
const visibilityEl = document.querySelector(".visibility"); // Visibility

// ========== SUN INFO ==========
const sunUpEl = document.querySelector(".sun-up");         // Sunrise
const sunDownEl = document.querySelector(".sun-down");     // Sunset



function updateWeatherUI(data, airData) {
  // City + Main Weather
  cityNameEl.textContent = data.name;
  mainTempEl.textContent = `${Math.round(data.main.temp)}°`;
  weatherDesEl.textContent = data.weather[0].description;
  minTempEl.textContent = `${Math.round(data.main.temp_min)}°`;
  maxTempEl.textContent = `${Math.round(data.main.temp_max)}°`;

  // Weather details
  cloudEl.textContent = data.clouds.all;
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;
  airPressureEl.textContent = data.main.pressure;
  visibilityEl.textContent = data.visibility / 1000; // convert m → km

  // Sunrise & Sunset
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  sunUpEl.textContent = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  sunDownEl.textContent = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
   // Progress bar for daylight
const sunProgressEl = document.querySelector(".sun-progress");

const now = Date.now(); // current time in ms
const sunriseMs = data.sys.sunrise * 1000;
const sunsetMs = data.sys.sunset * 1000;

let percentage = 0;

// If before sunrise → 0%, after sunset → 100%
if (now <= sunriseMs) {
  percentage = 0;
} else if (now >= sunsetMs) {
  percentage = 100;
} else {
  // Calculate fraction of day passed
  percentage = ((now - sunriseMs) / (sunsetMs - sunriseMs)) * 100;
}

// Update bar width
sunProgressEl.style.width = `${percentage}%`;






  // Air quality (if API provided)
  if (airData) {
    const aqi = airData.list[0].main.aqi;
    airIndexEl.textContent = aqi;
    airDesEl.textContent = getAirQualityLabel(aqi);
    airDes2El.textContent = getAirQualityDescription(aqi);
  }
}

// Helper functions for AQI
function getAirQualityLabel(aqi) {
  const labels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  return labels[aqi - 1] || "Unknown";
}

function getAirQualityDescription(aqi) {
  const desc = [
    "Good 🌿 - Air quality is satisfactory.",
    "Fair 🙂 - Acceptable air quality.",
    "Moderate 😐 - May affect sensitive groups.",
    "Poor 😷 - Health risks for some people.",
    "Very Poor ☠ - Health warning of emergency conditions."
  ];
  return desc[aqi - 1] || "No data available.";
}


document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // First: fetch weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
          .then(res => res.json())
          .then(weatherData => {
            console.log("Weather:", weatherData);

            // Second: fetch air quality, inside the weather .then()
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
              .then(res => res.json())
              .then(airData => {
                console.log("Air Quality:", airData);

                
                updateWeatherUI(weatherData, airData);
              })
              .catch(error => console.error("Error fetching air data:", error));
          })
          .catch(error => console.error("Error fetching weather data:", error));
      },
      error => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
});




const searchIcon = document.querySelector(".search");
  const searchForm = document.querySelector(".search-form");

  // Toggle form when clicking on the search icon
  searchIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from bubbling up
    searchForm.classList.toggle("hidden");
  });

  // Close the form if clicking outside
  document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target) && !searchIcon.contains(e.target)) {
      searchForm.classList.add("hidden");
    }
  });
  let  searchcity ='';
  
  searchForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      searchcity = document.querySelector(".search-input").value;
      console.log(searchcity);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchcity}&appid=${apiKey}&units=metric`)
    .then(Response => Response.json())
    .then(weatherData=>{
         console.log(weatherData);
         fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`)
              .then(res => res.json())
              .then(airData => {
                console.log("Air Quality:", airData);

                
                updateWeatherUI(weatherData, airData);

              })
      searchForm.classList.add("hidden");
      document.querySelector(".search-input").value = "";
      

    })
  })
 
