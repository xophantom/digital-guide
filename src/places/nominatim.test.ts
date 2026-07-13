import { describe, it, expect } from "vitest";
import { buildNominatimUrl, parseNominatimCoords } from "@/src/places/nominatim";
import { makeProperty } from "@/src/test/fixtures";

describe("buildNominatimUrl", () => {
  const url = buildNominatimUrl(makeProperty().address);
  it("inclui rua, cidade, estado e formato json", () => {
    expect(url).toContain("Lauro%20Linhares");
    expect(url).toContain("Florian");
    expect(url).toContain("SC");
    expect(url).toMatch(/format=json/);
  });
});

describe("parseNominatimCoords", () => {
  it("extrai lat/lon do primeiro resultado", () => {
    const coords = parseNominatimCoords([{ lat: "-27.59", lon: "-48.52" }]);
    expect(coords).toEqual({ lat: -27.59, lon: -48.52 });
  });
  it("retorna null quando vazio", () => {
    expect(parseNominatimCoords([])).toBeNull();
  });
});
