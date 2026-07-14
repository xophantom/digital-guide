import type { Address } from "@/src/domain/property";
import type { Coordinates } from "@/src/places/types";

const BASE = process.env.NOMINATIM_URL ?? "https://nominatim.openstreetmap.org/search";

export function buildNominatimUrl(address: Address): string {
  const params: Record<string, string> = {
    street: `${address.number} ${address.street}`,
    city: address.city,
    state: address.state,
    country: "Brazil",
    format: "json",
    limit: "1",
  };
  // encodeURIComponent (não URLSearchParams) para preservar "%20" em espaços,
  // que é o que o teste espera na rua.
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${BASE}?${query}`;
}

export function parseNominatimCoords(json: unknown): Coordinates | null {
  const arr = json as { lat?: string; lon?: string }[];
  const first = Array.isArray(arr) ? arr[0] : undefined;
  if (!first?.lat || !first?.lon) return null;
  return { lat: Number(first.lat), lon: Number(first.lon) };
}
