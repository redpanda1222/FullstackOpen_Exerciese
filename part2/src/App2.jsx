import React, { useEffect, useState } from "react";
import axios from "axios";

const App2 = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  // Fetch all countries on mount
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((res) => setCountries(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter countries based on search
  useEffect(() => {
    if (!search) {
      setFiltered([]);
      setSelectedCountry(null);
      setWeather(null);
      return;
    }

    const results = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(results);

    // Auto-select if only one match
    if (results.length === 1) {
      setSelectedCountry(results[0]);
    } else {
      setSelectedCountry(null);
      setWeather(null);
    }
  }, [search, countries]);

  // Fetch weather when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) return;

    setFiltered([selectedCountry]);

    const fetchWeather = async () => {
      try {
        const capital = selectedCountry.capital?.[0];
        if (!capital) return;

        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: capital,
              appid: import.meta.env.VITE_SOME_KEY,
              units: "metric",
            },
          }
        );

        setWeather(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();
  }, [selectedCountry]);

  const searchHandle = (event) => {
    setSearch(event.target.value);
  }

  const showHandle = (country) => {
    setSelectedCountry(country);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Country Search</h2>

      <input
        type="text"
        placeholder="Search country..."
        value={search}
        onChange={searchHandle}
        style={{ padding: "8px", width: "300px" }}
      />

      <div style={{ marginTop: "20px" }}>
        {/* Multiple results with buttons */}
        {filtered.length > 1 && (
          <ul>
            {filtered.map((c, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {c.name.common}{" "}
                <button onClick={() => showHandle(c)}>
                  Show
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Selected country details */}
        {selectedCountry && (
          <div style={{ marginTop: "20px" }}>
            <h3>{selectedCountry.name.common}</h3>
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0]}</p>
            <p><strong>Region:</strong> {selectedCountry.region}</p>
            <p><strong>Population:</strong> {selectedCountry.population}</p>

            <img
              src={selectedCountry.flags.png}
              alt="flag"
              width="150"
            />

            {/* Weather */}
            {weather && weather.main && (
              <div style={{ marginTop: "20px" }}>
                <h4>Weather in {selectedCountry.capital?.[0]}</h4>
                <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
                <p><strong>Condition:</strong> {weather.weather[0].description}</p>
                <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
              </div>
            )}
          </div>
        )}

        {/* No results */}
        {search && filtered.length === 0 && <p>No matches found.</p>}
      </div>
    </div>
  );
};

export default App2;