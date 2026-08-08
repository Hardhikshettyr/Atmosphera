import WeatherIcon from "../WeatherIcon";
import { formatDay, formatHour, getWeatherInfo } from "../../utils/weatherCodes";
import "./Forecast.css";

export default function Forecast({ weather }) {
  if (!weather) return null;
  const { hourly, daily, current } = weather;

  const startIdx = Math.max(
    0,
    hourly.time.findIndex((t) => new Date(t) >= new Date(current.time))
  );
  const next24 = hourly.time.slice(startIdx, startIdx + 24);

  return (
    <section className="forecast" aria-label="Forecast">
      <div className="forecast__block">
        <h3 className="forecast__heading">Hourly</h3>
        <div className="forecast__hourly-scroll">
          {next24.map((time, i) => {
            const idx = startIdx + i;
            const info = getWeatherInfo(hourly.weather_code[idx], 1);
            return (
              <div className="hourly-item" key={time}>
                <p className="hourly-item__time mono">{i === 0 ? "Now" : formatHour(time)}</p>
                <WeatherIcon name={info.icon} size={26} />
                <p className="hourly-item__temp">{Math.round(hourly.temperature_2m[idx])}°</p>
                <p className="hourly-item__precip mono">{hourly.precipitation_probability[idx]}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="forecast__block">
        <h3 className="forecast__heading">7-day</h3>
        <div className="forecast__daily-list">
          {daily.time.map((date, i) => {
            const info = getWeatherInfo(daily.weather_code[i], 1);
            const max = Math.round(daily.temperature_2m_max[i]);
            const min = Math.round(daily.temperature_2m_min[i]);
            return (
              <div className="daily-item" key={date}>
                <p className="daily-item__day">{formatDay(date, i)}</p>
                <div className="daily-item__icon">
                  <WeatherIcon name={info.icon} size={24} />
                </div>
                <p className="daily-item__precip mono">
                  {daily.precipitation_probability_max?.[i] ?? 0}%
                </p>
                <div className="daily-item__range">
                  <span className="daily-item__min mono">{min}°</span>
                  <span className="daily-item__bar" aria-hidden="true" />
                  <span className="daily-item__max mono">{max}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
