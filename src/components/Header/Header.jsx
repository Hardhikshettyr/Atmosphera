import SearchBar from "../SearchBar/SearchBar";
import "./Header.css";

export default function Header({ onSelectLocation, onUseLocation, locating }) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="16" cy="16" r="6" />
            <ellipse cx="16" cy="16" rx="14" ry="5.5" />
            <ellipse cx="16" cy="16" rx="14" ry="5.5" transform="rotate(60 16 16)" />
          </svg>
        </span>
        <div>
          <h1 className="header__title">Atmosphera</h1>
          <p className="header__tagline mono">live conditions, anywhere</p>
        </div>
      </div>

      <div className="header__controls">
        <SearchBar onSelectLocation={onSelectLocation} />
        <button
          type="button"
          className="header__locate"
          onClick={onUseLocation}
          disabled={locating}
          aria-label="Use my current location"
        >
          {locating ? (
            <span className="search-bar__spinner" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          )}
          <span>My location</span>
        </button>
      </div>
    </header>
  );
}
