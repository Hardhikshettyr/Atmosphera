import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./WeatherMap.css";

// Default Leaflet marker assets don't resolve correctly under bundlers —
// rebuild the icon from the CDN so pins render reliably.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToLocation({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null) {
      map.flyTo([latitude, longitude], Math.max(map.getZoom(), 7), { duration: 0.9 });
    }
  }, [latitude, longitude, map]);
  return null;
}

export default function WeatherMap({ location, onMapClick }) {
  const center = location ? [location.latitude, location.longitude] : [20, 0];
  const zoom = location ? 7 : 2;

  return (
    <div className="weather-map">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom minZoom={2} worldCopyJump>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ClickHandler onMapClick={onMapClick} />
        {location && (
          <>
            <Marker position={[location.latitude, location.longitude]} icon={markerIcon} />
            <FlyToLocation latitude={location.latitude} longitude={location.longitude} />
          </>
        )}
      </MapContainer>
      <p className="weather-map__hint mono">Click anywhere on the map for local conditions</p>
    </div>
  );
}
