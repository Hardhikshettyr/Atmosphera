import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { searchCities } from "../../services/geocodingService";
import "./SearchBar.css";

export default function SearchBar({ onSelectLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setSearchError(null);
        return;
      }
      setSearching(true);
      setSearchError(null);
      try {
        const cities = await searchCities(debouncedQuery);
        if (!cancelled) {
          setResults(cities);
          setOpen(true);
        }
      } catch (err) {
        if (!cancelled) setSearchError(err.message || "Search failed.");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city) {
    onSelectLocation({
      name: city.name,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      source: "search",
    });
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-bar__field">
        <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="Search for a city..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          aria-label="Search for a city"
        />
        {searching && <span className="search-bar__spinner" aria-hidden="true" />}
      </div>

      {open && (query.trim() || searchError) && (
        <ul className="search-bar__dropdown" role="listbox">
          {searchError && <li className="search-bar__empty">{searchError}</li>}
          {!searchError && !searching && results.length === 0 && debouncedQuery.trim() && (
            <li className="search-bar__empty">No cities found for "{debouncedQuery}"</li>
          )}
          {results.map((city, i) => (
            <li key={`${city.name}-${city.latitude}-${i}`}>
              <button type="button" onClick={() => handleSelect(city)}>
                <span className="search-bar__city">{city.name}</span>
                <span className="search-bar__region">
                  {[city.admin1, city.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
