import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import WeatherDetails from "./components/WeatherDetails/WeatherDetails";
import Forecast from "./components/Forecast/Forecast";
import WeatherMap from "./components/Map/WeatherMap";
import RecentSearches from "./components/RecentSearches/RecentSearches";
import Watchlist from "./components/Watchlist/Watchlist";
import Loading from "./components/Loading/Loading";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { useWeather } from "./hooks/useWeather";
import { reverseGeocode } from "./services/geocodingService";
import { getWeatherInfo } from "./utils/weatherCodes";
import {
  addRecentSearch,
  addToWatchlist,
  clearRecentSearches,
  getRecentSearches,
  getWatchlist,
  isInWatchlist,
  removeFromWatchlist,
} from "./utils/storage";
import "./App.css";

const DEFAULT_LOCATION = {
  name: "Bengaluru",
  country: "India",
  admin1: "Karnataka",
  latitude: 12.9716,
  longitude: 77.5946,
  source: "search",
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [recent, setRecent] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const { weather, loading, error, fetchWeather } = useWeather();

  useEffect(() => {
    setRecent(getRecentSearches());
    setWatchlist(getWatchlist());
    selectLocation(DEFAULT_LOCATION, { skipRecent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!weather) return;
    const info = getWeatherInfo(weather.current.weather_code, weather.current.is_day);
    document.documentElement.setAttribute("data-theme", info.theme);
  }, [weather]);

  async function selectLocation(loc, { skipRecent = false } = {}) {
    setLocation(loc);
    setLocationError(null);
    const data = await fetchWeather(loc.latitude, loc.longitude);
    if (data && !skipRecent) {
      setRecent(addRecentSearch(loc));
    }
  }

  function handleMapClick(lat, lng) {
    reverseGeocode(lat, lng).then((loc) => {
      selectLocation({ ...loc, source: "map" });
    });
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await reverseGeocode(latitude, longitude);
        await selectLocation({ ...loc, source: "gps" });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location access was denied. Enable it in your browser settings to use this feature.");
        } else {
          setLocationError("Couldn't determine your location. Try again or search for a city instead.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleToggleWatchlist() {
    if (!location) return;
    if (isInWatchlist(watchlist, location)) {
      setWatchlist(removeFromWatchlist(location));
    } else {
      const { list } = addToWatchlist({
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setWatchlist(list);
    }
  }

  function handleRemoveFromWatchlist(city) {
    setWatchlist(removeFromWatchlist(city));
  }

  const watchlisted = location ? isInWatchlist(watchlist, location) : false;

  return (
    <div className="app">
      <Header
        onSelectLocation={(loc) => selectLocation(loc)}
        onUseLocation={handleUseLocation}
        locating={locating}
      />

      <main className="app__layout">
        <div className="app__primary">
          {locationError && <ErrorMessage message={locationError} />}
          {loading && !weather && <Loading label="Locating conditions..." />}
          {error && <ErrorMessage message={error} onRetry={() => location && selectLocation(location)} />}

          {weather && location && !error && (
            <>
              <WeatherCard
                location={location}
                weather={weather}
                isWatchlisted={watchlisted}
                watchlistFull={watchlist.length >= 3}
                onToggleWatchlist={handleToggleWatchlist}
              />
              <WeatherDetails weather={weather} />
              <Forecast weather={weather} />
            </>
          )}

          <RecentSearches
            items={recent}
            onSelect={(loc) => selectLocation(loc, { skipRecent: true })}
            onClear={() => setRecent(clearRecentSearches())}
          />
        </div>

        <div className="app__secondary">
          <WeatherMap location={location} onMapClick={handleMapClick} />
          <Watchlist
            cities={watchlist}
            onSelect={(loc) => selectLocation(loc, { skipRecent: true })}
            onRemove={handleRemoveFromWatchlist}
          />
        </div>
      </main>
    </div>
  );
}
