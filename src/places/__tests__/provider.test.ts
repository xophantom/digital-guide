import { describe, it, expect, afterEach } from "vitest";
import { getPlacesProvider, groupAndRank } from "@/src/places/provider";
import { makeProperty } from "@/src/test/fixtures";
import type { Place } from "@/src/places/types";

const orig = process.env.PLACES_PROVIDER;
afterEach(() => { process.env.PLACES_PROVIDER = orig; });

describe("getPlacesProvider (fake)", () => {
  it("no modo fake retorna lugares determinísticos sem tocar a rede", async () => {
    process.env.PLACES_PROVIDER = "fake";
    const nearby = await getPlacesProvider().findNearby(makeProperty().address);
    expect(nearby.restaurants.length).toBeGreaterThanOrEqual(4);
    expect(nearby.hospitals.length).toBeGreaterThanOrEqual(1);
  });
});

describe("groupAndRank", () => {
  it("agrupa por categoria, ordena por distância e limita", () => {
    const places: Place[] = [
      { name: "A", category: "restaurant", lat: 0, lon: 0, distanceMeters: 300 },
      { name: "B", category: "restaurant", lat: 0, lon: 0, distanceMeters: 100 },
      { name: "C", category: "restaurant", lat: 0, lon: 0, distanceMeters: 200 },
    ];
    const grouped = groupAndRank(places, { restaurants: 2 });
    expect(grouped.restaurants.map((p) => p.name)).toEqual(["B", "C"]);
  });
});
