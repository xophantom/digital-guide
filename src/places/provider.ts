import type { Address } from "@/src/domain/property";
import type { NearbyPlaces, Place } from "@/src/places/types";
import { buildOverpassQuery, parseOverpassPlaces } from "@/src/places/overpass";
import { buildNominatimUrl, parseNominatimCoords } from "@/src/places/nominatim";
import { FAKE_NEARBY } from "@/src/places/fakePlaces";

export type PlacesProvider = { findNearby(address: Address): Promise<NearbyPlaces> };

const EMPTY: NearbyPlaces = {
  restaurants: [], attractions: [], pharmacies: [], markets: [], hospitals: [],
};

type Limits = Partial<Record<keyof NearbyPlaces, number>>;
const DEFAULT_LIMITS: Required<Limits> = {
  restaurants: 5, attractions: 4, pharmacies: 2, markets: 2, hospitals: 2,
};

export function groupAndRank(places: Place[], limits: Limits = {}): NearbyPlaces {
  const l = { ...DEFAULT_LIMITS, ...limits };
  const byCat = (cat: Place["category"], n: number) =>
    places.filter((p) => p.category === cat).sort((a, b) => a.distanceMeters - b.distanceMeters).slice(0, n);
  return {
    restaurants: byCat("restaurant", l.restaurants),
    attractions: byCat("attraction", l.attractions),
    pharmacies: byCat("pharmacy", l.pharmacies),
    markets: byCat("market", l.markets),
    hospitals: byCat("hospital", l.hospitals),
  };
}

const UA = "seazone-digital-guide/1.0 (teste técnico)";
const OVERPASS = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { "User-Agent": UA, ...(init?.headers ?? {}) },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

class OverpassPlacesProvider implements PlacesProvider {
  async findNearby(address: Address): Promise<NearbyPlaces> {
    try {
      const geo = await fetchJson(buildNominatimUrl(address));
      const center = parseNominatimCoords(geo);
      if (!center) return EMPTY; // sem geocoding → tudo fallback
      const overpass = await fetchJson(OVERPASS, {
        method: "POST",
        body: `data=${encodeURIComponent(buildOverpassQuery(center))}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return groupAndRank(parseOverpassPlaces(overpass, center));
    } catch {
      return EMPTY; // qualquer falha de rede → fallback, nunca quebra
    }
  }
}

class FakePlacesProvider implements PlacesProvider {
  async findNearby(): Promise<NearbyPlaces> {
    return FAKE_NEARBY;
  }
}

export function getPlacesProvider(): PlacesProvider {
  return process.env.PLACES_PROVIDER === "fake"
    ? new FakePlacesProvider()
    : new OverpassPlacesProvider();
}
