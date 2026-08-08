import { degreesToCompass, formatTime } from "../../utils/weatherCodes";
import "./WeatherDetails.css";

function DetailTile({ label, value, unit, sub }) {
  return (
    <div className="detail-tile">
      <p className="detail-tile__label mono">{label}</p>
      <p className="detail-tile__value">
        {value}
        {unit && <span className="detail-tile__unit">{unit}</span>}
      </p>
      {sub && <p className="detail-tile__sub">{sub}</p>}
    </div>
  );
}

export default function WeatherDetails({ weather }) {
  if (!weather) return null;
  const current = weather.current;
  const daily = weather.daily;
  const hourly = weather.hourly;

  const nowIdx = hourly?.time?.findIndex((t) => new Date(t) >= new Date(current.time)) ?? -1;
  const visibility = hourly?.visibility?.[nowIdx >= 0 ? nowIdx : 0];

  return (
    <section className="weather-details" aria-label="Weather details">
      <DetailTile label="Humidity" value={current.relative_humidity_2m} unit="%" />
      <DetailTile
        label="Wind"
        value={Math.round(current.wind_speed_10m)}
        unit=" km/h"
        sub={degreesToCompass(current.wind_direction_10m)}
      />
      <DetailTile label="Pressure" value={Math.round(current.surface_pressure)} unit=" hPa" />
      <DetailTile
        label="Visibility"
        value={visibility != null ? (visibility / 1000).toFixed(1) : "--"}
        unit=" km"
      />
      <DetailTile label="Sunrise" value={formatTime(daily.sunrise?.[0])} />
      <DetailTile label="Sunset" value={formatTime(daily.sunset?.[0])} />
    </section>
  );
}
