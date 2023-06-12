import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${apiKey}`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [country.capital, apiKey]);

  return (
    <div>
      <h2>{country.name}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map((language) => (
          <li key={language.iso639_1}>{language.name}</li>
        ))}
      </ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} width="200" />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
          <p>Description: {weather.weather[0].description}</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

const Countries = ({ countries, handleShowCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, please specify another filter.</p>;
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.alpha3Code}>
            {country.name}
            <button onClick={() => handleShowCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  } else {
    return <p>No matches found.</p>;
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleShowCountry = (country) => {
    setFilter(country.name);
  };

  return (
    <div>
      <h1>Country Search</h1>
      <form>
        <label htmlFor="filter">Find countries: </label>
        <input type="text" id="filter" value={filter} onChange={handleFilterChange} />
      </form>
      <Countries countries={filteredCountries} handleShowCountry={handleShowCountry} />
    </div>
  );
};

export default App;
