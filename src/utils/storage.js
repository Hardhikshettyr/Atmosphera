const RECENT_KEY = "atmosphera.recentSearches";
const WATCHLIST_KEY = "atmosphera.watchlist";
const RECENT_LIMIT = 5;
const WATCHLIST_LIMIT = 3;

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getRecentSearches() {
  return safeParse(localStorage.getItem(RECENT_KEY), []);
}

export function addRecentSearch(location) {
  const existing = getRecentSearches().filter(
    (item) => !(item.latitude === location.latitude && item.longitude === location.longitude)
  );
  const updated = [location, ...existing].slice(0, RECENT_LIMIT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
  return [];
}

export function getWatchlist() {
  return safeParse(localStorage.getItem(WATCHLIST_KEY), []);
}

export function isInWatchlist(watchlist, location) {
  return watchlist.some(
    (item) => item.latitude === location.latitude && item.longitude === location.longitude
  );
}

export function addToWatchlist(location) {
  const current = getWatchlist();
  if (current.length >= WATCHLIST_LIMIT) return { list: current, full: true };
  if (isInWatchlist(current, location)) return { list: current, full: false };
  const updated = [...current, location];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return { list: updated, full: false };
}

export function removeFromWatchlist(location) {
  const updated = getWatchlist().filter(
    (item) => !(item.latitude === location.latitude && item.longitude === location.longitude)
  );
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
}
