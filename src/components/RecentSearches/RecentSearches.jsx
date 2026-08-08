import "./RecentSearches.css";

export default function RecentSearches({ items, onSelect, onClear }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="recent-searches" aria-label="Recent searches">
      <div className="recent-searches__header">
        <h3>Recent</h3>
        <button type="button" onClick={onClear} className="recent-searches__clear">
          Clear
        </button>
      </div>
      <div className="recent-searches__chips">
        {items.map((loc, i) => (
          <button
            key={`${loc.latitude}-${loc.longitude}-${i}`}
            type="button"
            className="recent-searches__chip"
            onClick={() => onSelect({ ...loc, source: "recent" })}
          >
            {loc.name}
          </button>
        ))}
      </div>
    </section>
  );
}
