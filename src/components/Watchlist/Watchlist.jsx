import { useEffect, useState } from "react";
import WeatherIcon from "../WeatherIcon";
import { getWeather } from "../../services/weatherService";
import { getWeatherInfo } from "../../utils/weatherCodes";
import "./Watchlist.css";

export default function Watchlist({ cities, onSelect, onRemove }) {
  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cities.length === 0) {
      setEntries({});
      return;
    }
    let cancelled = false;
    setLoading(true);

    // Fetch every watchlist city concurrently rather than one at a time.
    Promise.all(
      cities.map(async (city) => {
        try {
          const data = await getWeather(city.latitude, city.longitude);
          return [`${city.latitude},${city.longitude}`, { data, error: null }];
        } catch (err) {
          return [`${city.latitude},${city.longitude}`, { data: null, error: err.message }];
        }
      })
    ).then((results) => {
      if (cancelled) return;
      setEntries(Object.fromEntries(results));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cities]);

  if (cities.length === 0) {
    return (
      <section className="watchlist" aria-label="Watchlist">
        <h3 className="watchlist__heading">Watchlist</h3>
        <p className="watchlist__empty">
          Star a location to pin it here — track up to 3 cities side by side.
        </p>
      </section>
    );
  }

  return (
    <section className="watchlist" aria-label="Watchlist">
      <h3 className="watchlist__heading">Watchlist</h3>
      <div className="watchlist__list">
        {cities.map((city) => {
          const key = `${city.latitude},${city.longitude}`;
          const entry = entries[key];
          return (
            <div key={key} className="watchlist-item">
              <button
                type="button"
                className="watchlist-item__main"
                onClick={() => onSelect({ ...city, source: "watchlist" })}
              >
                <div>
                  <p className="watchlist-item__name">{city.name}</p>
                  <p className="watchlist-item__region">{city.country}</p>
                </div>
                {loading && !entry && <span className="search-bar__spinner" aria-hidden="true" />}
                {entry?.error && <span className="watchlist-item__error">--</span>}
                {entry?.data && (
                  <div className="watchlist-item__reading">
                    <WeatherIcon
                      name={getWeatherInfo(entry.data.current.weather_code, entry.data.current.is_day).icon}
                      size={22}
                    />
                    <span className="watchlist-item__temp">
                      {Math.round(entry.data.current.temperature_2m)}°
                    </span>
                  </div>
                )}
              </button>
              <button
                type="button"
                className="watchlist-item__remove"
                onClick={() => onRemove(city)}
                aria-label={`Remove ${city.name} from watchlist`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
