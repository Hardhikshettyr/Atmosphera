import WeatherIcon from "../WeatherIcon";
import { getWeatherInfo } from "../../utils/weatherCodes";
import "./WeatherCard.css";

const SOURCE_LABEL = {
  search: "Searched city",
  map: "Map-selected location",
  gps: "Current location",
  recent: "Recent search",
  watchlist: "Watchlist",
};

export default function WeatherCard({ location, weather, onToggleWatchlist, isWatchlisted, watchlistFull }) {
  if (!location || !weather) return null;
  const current = weather.current;
  const info = getWeatherInfo(current.weather_code, current.is_day);

  return (
    <section className="weather-card" aria-label="Current weather">
      <div className="weather-card__top">
        <div>
          <p className="weather-card__source mono">{SOURCE_LABEL[location.source] || "Selected location"}</p>
          <h2 className="weather-card__place">{location.name}</h2>
          <p className="weather-card__region">
            {[location.admin1, location.country].filter(Boolean).join(", ") || "\u00A0"}
          </p>
        </div>
        <button
          type="button"
          className={`weather-card__star ${isWatchlisted ? "is-active" : ""}`}
          onClick={onToggleWatchlist}
          title={
            isWatchlisted
              ? "Remove from watchlist"
              : watchlistFull
              ? "Watchlist full (max 3)"
              : "Add to watchlist"
          }
          disabled={!isWatchlisted && watchlistFull}
        >
          <svg viewBox="0 0 24 24" fill={isWatchlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9 12 2" />
          </svg>
        </button>
      </div>

      <div className="weather-card__main">
        <div className="weather-card__icon">
          <WeatherIcon name={info.icon} size={88} />
        </div>
        <div className="weather-card__temp-block">
          <span className="weather-card__temp">{Math.round(current.temperature_2m)}°</span>
          <div className="weather-card__meta">
            <p className="weather-card__condition">{info.label}</p>
            <p className="weather-card__feels mono">
              Feels like {Math.round(current.apparent_temperature)}°
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
