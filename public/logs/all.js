const myMap = L.map('checkInMap').setView([0,0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);


async function getData() {
  const response = await fetch("/api");
  const data = await response.json();
  console.log(data);
  for(let item of data){
    const marker = L.marker([item.lat, item.lon]).addTo(myMap);
    let txt = `The weather here at ${item.lat.toFixed(2)}&deg;,
    ${item.lon.toFixed(2)}&deg; is ${item.weather_data.weather[0].description} with
    a temperature of ${Math.round(item.weather_data.main.temp)}&deg; C.`;

    // if (item.air.value < 0) {
    //   txt += '  No air quality reading.';
    // } else {
    //   txt += `  The concentration of particulate matter 
    // (${item.air.parameter}) is ${item.air.value} 
    // ${item.air.unit} last read on ${item.air.lastUpdated}`;
    // }
    marker.bindPopup(txt);
  }
  
  

  // const container = document.getElementById("container");

  // if (!data || data.length === 0) {
  //   const root = document.createElement("p");
  //   root.textContent = "currently there are no check-ins!";
  //   container.append(root);
  // } else {
  //   for (let item of data) {
  //     const root = document.createElement("p");
  //     const geo = document.createElement("div");
  //     const date = document.createElement("div");

  //     geo.textContent = `location: ${item.lat.toFixed(2)}°, ${item.lon.toFixed(
  //       2
  //     )}°`;
  //     const dateString = new Date(item.timestamp).toLocaleString();
  //     date.textContent = `date: ${dateString}`;

  //     root.append(geo, date);
  //     container.append(root);
  //     root.className = "description";
  //   }
  // }
  // console.log(data);
}

getData();
