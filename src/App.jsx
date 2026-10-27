
import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [loading, setLoading] = useState(false);

  async function getWeather(cityName) {
    setLoading(true);
    setWeatherError('');
    setTemperature(null);
    setSearchedCity('');

    try {
      // Step 1: Find the city's coordinates
      const cityResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
      );

      if (!cityResponse.ok) {
        throw new Error('Could not find the city.');
      }

      const cityData = await cityResponse.json();

      if (!cityData.results || cityData.results.length === 0) {
        throw new Error('City not found. Please try another city.');
      }

      const { latitude, longitude } = cityData.results[0];

      // Step 2: Get the current weather
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
      );

      if (!weatherResponse.ok) {
        throw new Error('Could not fetch weather data.');
      }

      const weatherData = await weatherResponse.json();

      setTemperature(weatherData.current.temperature_2m);
      setSearchedCity(cityData.results[0].name);
    } catch (error) {
      setWeatherError(error.message || 'Unable to fetch weather.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (city.trim() === '') {
      alert('Please enter a city name!');
      return;
    }

    getWeather(city.trim());
  }

return (
  <div className="dashboard">
    <div className="weather-card">
      <h1>🌤️ Weather Dashboard</h1>

      <p className="subtitle">
        Check the current weather in your city
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {weatherError && (
        <p className="message">{weatherError}</p>
      )}

      {searchedCity && temperature !== null && (
        <div className="weather-result">
          <h2>📍 {searchedCity}</h2>

          <p className="temperature">
            {temperature}°C
          </p>

          <p>Current Temperature</p>
        </div>
      )}
    </div>
  </div>
);


 
}

export default App;

