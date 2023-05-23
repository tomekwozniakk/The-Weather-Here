const express = require("express");
const Datastore = require("@rmanibus/nedb");
const fetch = require("node-fetch");
require("dotenv").config();


const app = express();

app.listen(3000, () => console.log("Listening at 3000..."));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api", (request, response) => {
  console.log("I got a request!");
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

app.get("/weather/:latlon", async (request, response) => {
  const latlon = request.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];

  const API_KEY = process.env.API_KEY;
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=100000&limit=1&parameter=pm25&order_by=lastUpdated`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const weather_forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const weather_forecast_response = await fetch(weather_forecast_url);
  const weather_forecast_data = await weather_forecast_response.json();

  const data = {
    weather: weather_data,
    aq: aq_data,
    forecast: weather_forecast_data,
  };
  response.json(data);
});
