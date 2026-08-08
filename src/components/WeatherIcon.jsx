// Lightweight hand-drawn SVG icon set keyed by the icon name from weatherCodes.js.
// Kept dependency-free and stroke-based to match the app's sharp, geometric visual language.

function Sun() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="9" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="6"
          x2="24"
          y2="12"
          transform={`rotate(${deg} 24 24)`}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M31 8a16 16 0 1 0 9 24 12.5 12.5 0 0 1-9-24z" strokeLinejoin="round" />
    </svg>
  );
}

function CloudSun() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="16" cy="16" r="6" />
      <path d="M13 30h20a7 7 0 0 0 0-14 9 9 0 0 0-17-2A7.5 7.5 0 0 0 13 30z" strokeLinejoin="round" />
    </svg>
  );
}

function Cloud() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 32h24a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18-2A7.5 7.5 0 0 0 11 32z" strokeLinejoin="round" />
    </svg>
  );
}

function Fog() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M13 20h22" />
      <path d="M9 26h30" />
      <path d="M13 32h22" />
    </svg>
  );
}

function Drizzle() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 24h24a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18-2A7.5 7.5 0 0 0 11 24z" strokeLinejoin="round" />
      <line x1="17" y1="32" x2="15" y2="38" />
      <line x1="24" y1="32" x2="22" y2="38" />
      <line x1="31" y1="32" x2="29" y2="38" />
    </svg>
  );
}

function Rain() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 22h24a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18-2A7.5 7.5 0 0 0 11 22z" strokeLinejoin="round" />
      <line x1="16" y1="30" x2="13" y2="40" />
      <line x1="24" y1="30" x2="21" y2="40" />
      <line x1="32" y1="30" x2="29" y2="40" />
    </svg>
  );
}

function Snow() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 22h24a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18-2A7.5 7.5 0 0 0 11 22z" strokeLinejoin="round" />
      <g>
        <line x1="16" y1="30" x2="16" y2="40" />
        <line x1="11.5" y1="35" x2="20.5" y2="35" />
      </g>
      <g>
        <line x1="32" y1="30" x2="32" y2="40" />
        <line x1="27.5" y1="35" x2="36.5" y2="35" />
      </g>
    </svg>
  );
}

function Storm() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 20h24a7 7 0 0 0 0-14 9.5 9.5 0 0 0-18-2A7.5 7.5 0 0 0 11 20z" strokeLinejoin="round" />
      <path d="M25 26l-6 10h6l-4 8" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  sun: Sun,
  moon: Moon,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: Fog,
  drizzle: Drizzle,
  rain: Rain,
  snow: Snow,
  storm: Storm,
};

export default function WeatherIcon({ name, size = 48, className = "" }) {
  const Icon = ICONS[name] || Cloud;
  return (
    <span className={`weather-icon ${className}`} style={{ width: size, height: size, display: "inline-flex" }}>
      <Icon />
    </span>
  );
}
