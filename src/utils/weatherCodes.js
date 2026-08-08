// Open-Meteo WMO weather interpretation codes
// https://open-meteo.com/en/docs

const CODE_MAP = {
  0: { label: "Clear sky", theme: "clear", icon: "sun" },
  1: { label: "Mainly clear", theme: "clear", icon: "sun" },
  2: { label: "Partly cloudy", theme: "cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", theme: "cloudy", icon: "cloud" },
  45: { label: "Fog", theme: "fog", icon: "fog" },
  48: { label: "Depositing rime fog", theme: "fog", icon: "fog" },
  51: { label: "Light drizzle", theme: "rain", icon: "drizzle" },
  53: { label: "Moderate drizzle", theme: "rain", icon: "drizzle" },
  55: { label: "Dense drizzle", theme: "rain", icon: "drizzle" },
  56: { label: "Light freezing drizzle", theme: "snow", icon: "drizzle" },
  57: { label: "Dense freezing drizzle", theme: "snow", icon: "drizzle" },
  61: { label: "Slight rain", theme: "rain", icon: "rain" },
  63: { label: "Moderate rain", theme: "rain", icon: "rain" },
  65: { label: "Heavy rain", theme: "rain", icon: "rain" },
  66: { label: "Light freezing rain", theme: "snow", icon: "rain" },
  67: { label: "Heavy freezing rain", theme: "snow", icon: "rain" },
  71: { label: "Slight snow fall", theme: "snow", icon: "snow" },
  73: { label: "Moderate snow fall", theme: "snow", icon: "snow" },
  75: { label: "Heavy snow fall", theme: "snow", icon: "snow" },
  77: { label: "Snow grains", theme: "snow", icon: "snow" },
  80: { label: "Slight rain showers", theme: "rain", icon: "rain" },
  81: { label: "Moderate rain showers", theme: "rain", icon: "rain" },
  82: { label: "Violent rain showers", theme: "rain", icon: "rain" },
  85: { label: "Slight snow showers", theme: "snow", icon: "snow" },
  86: { label: "Heavy snow showers", theme: "snow", icon: "snow" },
  95: { label: "Thunderstorm", theme: "storm", icon: "storm" },
  96: { label: "Thunderstorm, slight hail", theme: "storm", icon: "storm" },
  99: { label: "Thunderstorm, heavy hail", theme: "storm", icon: "storm" },
};

export function getWeatherInfo(code, isDay = 1) {
  const entry = CODE_MAP[code] || { label: "Unknown", theme: "cloudy", icon: "cloud" };
  let theme = entry.theme;
  let icon = entry.icon;
  if (theme === "clear" && !isDay) {
    theme = "night";
    icon = "moon";
  }
  return { ...entry, theme, icon, isDay: !!isDay };
}

export function degreesToCompass(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}

export function formatTime(isoString) {
  if (!isoString) return "--:--";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatHour(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "numeric" });
}

export function formatDay(isoString, index) {
  if (index === 0) return "Today";
  const d = new Date(isoString);
  return d.toLocaleDateString([], { weekday: "short" });
}
