import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.css";
import sunset from "../assets/sunset.gif";
import sunrise from "../assets/sunrise.gif";
import hot from "../assets/hot.gif";
import cold from "../assets/cold.gif";
import humidity from "../assets/humidity.png";
import pressure from "../assets/pressure.png";

const Searchcity = () => {
  const [timeGap, setTimeGap] = useState("");
  const [data, setData] = useState({
    city: "",
    temp: 0,
    temp_max: 0,
    temp_min: 0,
    humidity: 0,
    sunrise: 0,
    sunset: 0,
    country: "",
    desc: "",
    icon: "",
    pressure: 0,
    windSpeed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCitySuggestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=d8596b1261b43be39522177d29112a96`
        );
        const citySuggestions = response.data.map((city) => city.name);
        setSuggestions(citySuggestions);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchCitySuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const getData = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d8596b1261b43be39522177d29112a96`
      );
      const responseData = {
        desc: response.data.weather[0].main,
        icon: response.data.weather[0].icon,
        city: response.data.name,
        temp: response.data.main.temp,
        temp_max: response.data.main.temp_max,
        temp_min: response.data.main.temp_min,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset,
        country: response.data.sys.country,
      };
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
    clearTimeout(timeGap);
    const timeout = setTimeout(() => {
      getData(searchTerm);
    }, 500);
    setTimeGap(timeout);
  };

  const handleSearch = (selectedCity) => {
    setSearchTerm(selectedCity);
    getData(selectedCity);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="inputData">
          <input
            type="text"
            placeholder="Enter City Name"
            value={searchTerm}
            onChange={handleOnChange}
          />
          <div className="searchicon">
            <SearchIcon />
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {suggestions.length > 0 && (
          <div className="searchData">
            {suggestions.map((city, index) => (
              <p key={index} onClick={() => handleSearch(city)}>
                {city}
              </p>
            ))}
          </div>
        )}

        <>
          <div className="city">
            <h3>
              <i className="fa-sharp fa-solid fa-location-dot"></i> {data.city}{" "}
              {data.country}
            </h3>
          </div>
          <div className="info">
            <p>{data.temp} °C</p>
          </div>
          <div className="boxes">
            <Box title="Max Temp" value={`${data.temp_max} °C`} imgSrc={hot} />
            <Box title="Min Temp" value={`${data.temp_min} °C`} imgSrc={cold} />
            <Box
              title="Sunrise"
              value={moment(data.sunrise * 1000).format("hh:mm a")}
              imgSrc={sunrise}
            />
            <Box
              title="Sunset"
              value={moment(data.sunset * 1000).format("hh:mm a")}
              imgSrc={sunset}
            />
            <Box title="Pressure" value={data.pressure} imgSrc={pressure} />
            <Box title="Humidity" value={data.humidity} imgSrc={humidity} />
          </div>
        </>
      </div>
    </div>
  );
};

const Box = ({ title, value, imgSrc }) => (
  <div className="box">
    <h4>{title}</h4>
    <div className="border">
      <img src={imgSrc} className="img" alt={title} />
    </div>
    <h3>{value}</h3>
  </div>
);

export default Searchcity;
