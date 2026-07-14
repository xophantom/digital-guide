import { describe, it, expect } from "vitest";
import { haversineMeters } from "@/src/places/distance";

describe("haversineMeters", () => {
  it("é ~0 para o mesmo ponto", () => {
    expect(haversineMeters({ lat: -27.6, lon: -48.5 }, { lat: -27.6, lon: -48.5 })).toBeLessThan(1);
  });
  it("aproxima a distância entre dois pontos conhecidos (~1,1 km por 0,01° de latitude)", () => {
    const d = haversineMeters({ lat: -27.60, lon: -48.5 }, { lat: -27.61, lon: -48.5 });
    expect(d).toBeGreaterThan(1000);
    expect(d).toBeLessThan(1200);
  });
});
