import type { Coordinates, Place, PlaceCategory } from "@/src/places/types";
import { haversineMeters } from "@/src/places/distance";

// tag OSM → categoria do guia. Raios por categoria (metros).
const SELECTORS: { tag: string; category: PlaceCategory; radius: number }[] = [
  { tag: '"amenity"="restaurant"', category: "restaurant", radius: 2500 },
  { tag: '"tourism"="attraction"', category: "attraction", radius: 8000 },
  { tag: '"tourism"="viewpoint"', category: "attraction", radius: 8000 },
  { tag: '"tourism"="museum"', category: "attraction", radius: 8000 },
  { tag: '"amenity"="pharmacy"', category: "pharmacy", radius: 2000 },
  { tag: '"shop"="supermarket"', category: "market", radius: 2500 },
  { tag: '"amenity"="hospital"', category: "hospital", radius: 6000 },
];

export function buildOverpassQuery(center: Coordinates): string {
  const parts = SELECTORS.flatMap((s) => [
    `node[${s.tag}](around:${s.radius},${center.lat},${center.lon});`,
    `way[${s.tag}](around:${s.radius},${center.lat},${center.lon});`,
  ]).join("");
  return `[out:json][timeout:25];(${parts});out center;`;
}

function categoryOf(tags: Record<string, string>): PlaceCategory | null {
  if (tags.amenity === "restaurant") return "restaurant";
  if (tags.tourism === "attraction" || tags.tourism === "viewpoint" || tags.tourism === "museum") return "attraction";
  if (tags.amenity === "pharmacy") return "pharmacy";
  if (tags.shop === "supermarket") return "market";
  if (tags.amenity === "hospital") return "hospital";
  return null;
}

export function parseOverpassPlaces(json: unknown, center: Coordinates): Place[] {
  const elements = (json as { elements?: unknown[] })?.elements ?? [];
  const places: Place[] = [];
  for (const el of elements) {
    const e = el as { lat?: number; lon?: number; center?: Coordinates; tags?: Record<string, string> };
    const tags = e.tags;
    const name = tags?.name;
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (!tags || !name || lat == null || lon == null) continue;
    const category = categoryOf(tags);
    if (!category) continue;
    places.push({ name, category, lat, lon, distanceMeters: haversineMeters(center, { lat, lon }) });
  }
  return places;
}
