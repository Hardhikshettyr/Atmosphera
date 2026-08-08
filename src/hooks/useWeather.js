import { useCallback, useState } from "react";
import { getWeather, WeatherServiceError } from "../services/weatherService";

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(latitude, longitude);
      setWeather(data);
      return data;
    } catch (err) {
      const message = err instanceof WeatherServiceError ? err.message : "Something went wrong fetching the weather.";
      setError(message);
      setWeather(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather, setError };
}
