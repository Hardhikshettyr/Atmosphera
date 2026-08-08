# 🌦️ Atmosphera

**A dark-themed, interactive weather dashboard.** Search any city, click anywhere on a live map, or use your current location — get real-time conditions, an hourly + 7-day forecast, and a map marker that stays perfectly in sync with whatever you're viewing.


![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Features

- 🔍 **City search** — debounced live search with a dropdown of matches (Open-Meteo geocoding)
- 🗺️ **Click-anywhere map** — click any point on the map to get weather for that exact spot, reverse-geocoded to a place name
- 📍 **Use my location** — one-click geolocation with graceful handling of denied/unavailable permissions
- 🌡️ **Full current-conditions dashboard** — temperature, feels-like, humidity, wind speed & direction, pressure, visibility, sunrise/sunset
- ⏱️ **Hourly forecast** — scrollable 24-hour strip with temperature and precipitation probability
- 📅 **7-day forecast** — daily highs/lows with condition icons
- ⭐ **Watchlist** — pin up to 3 cities, fetched concurrently with `Promise.all()`
- 🕓 **Recent searches** — last 5 locations, persisted in `localStorage`
- 🎨 **Condition-reactive theming** — the entire UI's accent color shifts based on current weather (clear / cloudy / rain / storm / snow / fog / night)
- 📱 **Fully responsive** — map and dashboard stack vertically on mobile, no naive shrinking
- 🛡️ **Robust error handling** — network failures, empty searches, no results, denied geolocation, rate limits — nothing dead-ends on a blank screen

---

## 🖥️ Tech Stack

| Layer | Tech |
|---|---|
| UI Library | React 19 (hooks only, no class components) |
| Build tool | Vite |
| Styling | Plain CSS (component-scoped, no Tailwind, no CSS-in-JS) |
| Map | Leaflet + React-Leaflet, CARTO dark tile layer |
| Weather + geocoding | [Open-Meteo](https://open-meteo.com) (free, no API key) |
| Reverse geocoding | [BigDataCloud](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) client API (free, no API key) |
| Persistence | Browser `localStorage` |
| Language | JavaScript (ES6+) |


---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header/            # logo, search bar, "my location" button
│   ├── SearchBar/          # debounced live city search dropdown
│   ├── WeatherCard/        # hero card — location, temp, condition, watchlist star
│   ├── WeatherDetails/     # humidity / wind / pressure / visibility / sunrise / sunset grid
│   ├── Forecast/           # 24h scrollable strip + 7-day list
│   ├── Map/                # Leaflet map, click-to-select, flies to new location
│   ├── Watchlist/          # up to 3 pinned cities, fetched concurrently
│   ├── RecentSearches/     # last 5 searches from localStorage
│   ├── Loading/            # shared loading state UI
│   ├── ErrorMessage/       # shared error state UI
│   └── WeatherIcon.jsx     # dependency-free SVG icon set keyed by condition
├── services/
│   ├── weatherService.js   # Open-Meteo forecast fetch + 5-min in-memory cache
│   └── geocodingService.js # Open-Meteo search + BigDataCloud reverse geocode
├── hooks/
│   ├── useWeather.js       # loading/error/data state for the current forecast
│   └── useDebounce.js      # generic debounce hook
├── utils/
│   ├── weatherCodes.js     # WMO weather_code → label/icon/theme + formatters
│   └── storage.js          # localStorage helpers for recent searches & watchlist
├── styles/
│   └── index.css           # design tokens, theme variables, global reset
└── App.jsx                 # owns location + weather state, wires everything together
```

---

## 🔄 How Data Flows

**Search a city**
`SearchBar` → `geocodingService.searchCities()` (Open-Meteo geocoding) → user picks a result → `App.selectLocation()` → `useWeather.fetchWeather()` (Open-Meteo forecast) → map flies to the new marker, dashboard updates, location saved to Recent Searches.

**Click the map**
Leaflet click event → lat/lng → `geocodingService.reverseGeocode()` (BigDataCloud) resolves a place name → same `selectLocation()` flow as above.

**Use my location**
`navigator.geolocation.getCurrentPosition()` → reverse geocode → same flow, with explicit permission-denied and location-unavailable states.

**Watchlist**
Up to 3 saved cities. `Watchlist.jsx` fetches all of them concurrently with `Promise.all()` instead of sequentially, so three cards load in roughly the time of one request.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation

```bash
git clone https://github.com/Hardhikshettyr/Atmosphera.git
cd Atmosphera
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).




## 📸 Screenshots

*(Add screenshots or a demo GIF here before publishing — a hero shot of the dashboard plus one of the map view work well.)*

---


## 🙋 Author

Built by Hardhik.