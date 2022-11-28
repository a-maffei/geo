import "./App.css";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useMap, Marker, Popup, MapContainer, TileLayer } from "react-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import * as L from "leaflet";
import FlyToLocation from "./FlyToLocation";
import { DateTime } from "luxon";

function App() {
  const [ipData, setIpData] = useState("");
  const [position, setPosition] = useState([51.505, -0.09]);
  const [alphaCode, setAlphaCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [countryErroMsg, setCountryErroMsg] = useState("");
  const [countryFacts, setCountryFacts] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [localTime, setLocalTime] = useState();

  const IP_KEY = process.env.REACT_APP_IPIFY_API_KEY;
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_IPIFY_API_KEY}`;

  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  function fetchData() {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`I am an error of this kind ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setIpData(data.ip);
        setPosition([data.location.lat, data.location.lng]);
        setAlphaCode(data.location.country);
        setTimeZone(data.location.timezone);
        console.log(typeof timeZone);
      })
      .catch((err) => {
        setErrorMsg(err.message);
        return console.log(errorMsg);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function fetchCountryData() {
    fetch(`https://restcountries.com/v3.1/alpha/${alphaCode}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`I am an error of this kind ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCountryFacts(data[0]);
        console.log(data);
      })
      .catch((err) => {
        setCountryErroMsg(err.message);
        return console.log(countryErroMsg);
      });
  }

  useEffect(() => {
    alphaCode && fetchCountryData();
  }, [alphaCode]);

  let dateTime = DateTime.local().toHTTP();
  console.log("Current Date", dateTime);

  return (
    <div className="App">
      <h1>What's my IP?</h1>
      <p>My ip address happens to be: {ipData} </p>
      <p>It's located in: {countryFacts.name?.common} </p>
      <p>The capital of your country is: {countryFacts.capital} </p>
      <p>An here's your cute little flag: {countryFacts.flag} </p>
      <p>Your local date & time is {dateTime}</p>
      {
        <div
          className="leaflet-container"
          style={{ height: "600px", width: "600px" }}
        >
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "1000px", width: "800px" }}
          >
            <FlyToLocation position={position} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}></Marker>
          </MapContainer>
        </div>
      }
    </div>
  );
}

export default App;
