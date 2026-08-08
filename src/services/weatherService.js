const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class WeatherServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "WeatherServiceError";
  }
}

const CURRENT_FIELDS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "weather_code",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
].join(",");

const HOURLY_FIELDS = ["temperature_2m", "weather_code", "precipitation_probability", "visibility"].join(",");

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "sunrise",
  "sunset",
  "precipitation_probability_max",
].join(",");

// Simple in-memory cache to avoid refetching the same coordinates repeatedly
// within a short window (e.g. re-clicking the same map spot).
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(lat, lon) {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

export async function getWeather(latitude, longitude) {
  const key = cacheKey(latitude, longitude);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    timezone: "auto",
    forecast_days: "7",
  });

  let response;
  try {
    response = await fetch(`${FORECAST_URL}?${params.toString()}`);
  } catch {
    throw new WeatherServiceError("Couldn't reach the weather service. Check your network connection.");
  }

  if (response.status === 429) {
    throw new WeatherServiceError("Too many requests right now — please wait a moment and try again.");
  }
  if (!response.ok) {
    throw new WeatherServiceError("The weather service returned an error for that location.");
  }

  const data = await response.json();
  if (!data.current || !data.daily) {
    throw new WeatherServiceError("Weather data was incomplete for that location.");
  }

  cache.set(key, { data, time: Date.now() });
  return data;
}
