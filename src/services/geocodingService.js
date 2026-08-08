const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export class GeocodingError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeocodingError";
  }
}

export async function searchCities(query) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let response;
  try {
    response = await fetch(
      `${GEOCODE_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`
    );
  } catch {
    throw new GeocodingError("Network error while searching for that city. Check your connection.");
  }

  if (!response.ok) {
    throw new GeocodingError("The geocoding service is unavailable right now. Try again shortly.");
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) return [];

  return data.results.map((r) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    population: r.population,
  }));
}

export async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `${REVERSE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!response.ok) throw new Error("reverse geocode failed");
    const data = await response.json();
    const name =
      data.city || data.locality || data.principalSubdivision || data.countryName || "Selected location";
    return {
      name,
      country: data.countryName || "",
      admin1: data.principalSubdivision || "",
      latitude,
      longitude,
      timezone: undefined,
    };
  } catch {
    // Reverse geocoding is best-effort — fall back to raw coordinates so the
    // app still works even if this free service is briefly unavailable.
    return {
      name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      country: "",
      admin1: "",
      latitude,
      longitude,
      timezone: undefined,
    };
  }
}
