import { describe, it, expect } from "vitest";
import { SEED_PROPERTIES } from "@/src/db/seed-data";

describe("SEED_PROPERTIES", () => {
  it("inclui FLN001 e GRM001 com categorias corretas", () => {
    const codes = SEED_PROPERTIES.map((p) => p.code);
    expect(codes).toContain("FLN001");
    expect(codes).toContain("GRM001");
    const fln = SEED_PROPERTIES.find((p) => p.code === "FLN001")!;
    expect(fln.category).toBe("beach");
    const grm = SEED_PROPERTIES.find((p) => p.code === "GRM001")!;
    expect(grm.category).toBe("mountain");
  });

  it("tem ao menos 5 imóveis e códigos únicos", () => {
    const codes = SEED_PROPERTIES.map((p) => p.code);
    expect(codes.length).toBeGreaterThanOrEqual(5);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("cada imóvel tem ao menos uma imagem de origem", () => {
    for (const p of SEED_PROPERTIES) {
      expect(p.imageSources.length).toBeGreaterThan(0);
    }
  });
});
