let lat, lon;

function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

if ("geolocation" in navigator) {
  console.log("geolocation is available");
  navigator.geolocation.getCurrentPosition(async (position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById("latitude").textContent = lat.toFixed(2);
    document.getElementById("longitude").textContent = lon.toFixed(2);

    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    console.log(json);

    const weather_data = json.weather;

    const temperature = Math.round(weather_data.main.temp) || '-';
    const wind = Math.round(weather_data.wind.speed) || '-';
    const wind_gust = Math.round(weather_data.wind.gust) || "-";

    document.getElementById("summary").textContent =
      weather_data.weather[0].description;
    document.getElementById("temperature").textContent = temperature;
    document.getElementById(
      "temperature--big"
    ).textContent = `${temperature}°C`;



    if (json.aq.results) {
      const aq_data = json.aq.results[0];
      const pm25 = aq_data.measurements.filter(
        (result) => result.parameter === "pm25"
      );

      const aq_city = aq_data.city;
      const aq_location = aq_data.coordinates;

      document.getElementById("aq_value").textContent = pm25[0].value;
      document.getElementById("aq_units").textContent = pm25[0].unit;
      document.getElementById("aq_date").textContent = new Date(
        pm25[0].lastUpdated
      ).toLocaleString();
      if (aq_city) {
        document.getElementById("aq_location").textContent = aq_city;
      } else {
        document.getElementById(
          "aq_location"
        ).textContent = `${aq_location.latitude}, ${aq_location.longitude}`;
      }

      let aq_index;
      let aq_class;
      if (pm25[0].value <= 13) {
        aq_index = "Very Good";
        aq_class = "very_good";
      } else if (pm25[0].value > 13 && pm25[0].value <= 35) {
        aq_index = "Good";
        aq_class = "good";
      } else if (pm25[0].value > 35 && pm25[0].value <= 55) {
        aq_index = "Moderate";
        aq_class = "moderate";
      } else if (pm25[0].value > 55 && pm25[0].value <= 75) {
        aq_index = "Sufficient";
        aq_class = "sufficient";
      } else if (pm25[0].value > 75 && pm25[0].value <= 110) {
        aq_index = "Bad";
        aq_class = "bad";
      } else if (pm25[0].value > 110) {
        aq_index = "Very Bad";
        aq_class = "very_bad";
      }
      document.getElementById("air--quality").textContent = aq_index;
      document.getElementById("parameter--aq").classList.add(aq_class);
    } else {
      document.getElementById("air-description").textContent = 'NO AIR QUALITY READING AVAILABLE';
      document.getElementById("air--quality").textContent = '-';
    }


    document.getElementById(
      "weather--image"
    ).src = `https://openweathermap.org/img/wn/${weather_data.weather[0].icon}@4x.png`;

    document.getElementById(
      "pressure"
    ).textContent = `${weather_data.main.pressure} hPa`;
    document.getElementById(
      "wind-icon"
    ).style.transform = `rotate(${weather_data.wind.deg - 180}deg)`;
    document.getElementById("wind").textContent = `${wind}(${wind_gust})m/s`;

    let fanSpeed;
    fanSpeed = scale(weather_data.wind.speed, 0, 30, 3, 0);
    console.log(fanSpeed);

    document.getElementById(
      "wind-fan"
    ).style.animation = `fan ${fanSpeed}s linear 0s infinite both normal`;

    document.getElementById(
      "humidity"
    ).textContent = `${weather_data.main.humidity}%`;



    const data = {
      lat,
      lon,
      weather_data,
      aq_data
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const db_response = await fetch("/api", options);
    const db_json = await db_response.json();
    console.log(db_json);
  });
} else {
  console.log("geolocation is not available");
}