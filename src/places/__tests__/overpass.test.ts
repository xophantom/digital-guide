import { describe, it, expect } from "vitest";
import { buildOverpassQuery, parseOverpassPlaces } from "@/src/places/overpass";

const center = { lat: -27.6, lon: -48.5 };

describe("buildOverpassQuery", () => {
  const q = buildOverpassQuery(center);
  it("pede json e inclui as categorias por tag", () => {
    expect(q).toContain("[out:json]");
    expect(q).toContain('"amenity"="restaurant"');
    expect(q).toContain('"amenity"="pharmacy"');
    expect(q).toContain('"shop"="supermarket"');
    expect(q).toContain('"amenity"="hospital"');
    expect(q).toContain("around:");
    expect(q).toContain("-27.6");
    expect(q).toContain("-48.5");
  });
});

describe("parseOverpassPlaces", () => {
  const json = {
    elements: [
      { type: "node", lat: -27.601, lon: -48.5, tags: { amenity: "restaurant", name: "Boteco X" } },
      { type: "way", center: { lat: -27.62, lon: -48.5 }, tags: { amenity: "pharmacy", name: "Farmácia Y" } },
      { type: "node", lat: -27.6, lon: -48.5, tags: { amenity: "restaurant" } }, // sem name → ignorado
    ],
  };
  const places = parseOverpassPlaces(json, center);
  it("mapeia elementos com nome, categoria e distância; ignora sem nome", () => {
    expect(places.some((p) => p.name === "Boteco X" && p.category === "restaurant")).toBe(true);
    expect(places.some((p) => p.name === "Farmácia Y" && p.category === "pharmacy")).toBe(true);
    expect(places.every((p) => p.name)).toBe(true);
    expect(places.find((p) => p.name === "Boteco X")!.distanceMeters).toBeGreaterThan(0);
  });
});
