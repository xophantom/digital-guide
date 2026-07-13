import { describe, it, expect } from "vitest";
import { makeProperty } from "@/src/test/fixtures";

describe("makeProperty", () => {
  it("gera uma Property completa e coerente", () => {
    const p = makeProperty();
    expect(p.code).toBe("FLN001");
    expect(p.category).toBe("beach");
    expect(p.access.wifiPassword).toBeTruthy();
    expect(p.rules.checkInTime).toMatch(/\d{2}:\d{2}/);
    expect(p.images.length).toBeGreaterThan(0);
  });

  it("aplica overrides rasos", () => {
    const p = makeProperty({ name: "Outro", category: "mountain" });
    expect(p.name).toBe("Outro");
    expect(p.category).toBe("mountain");
    expect(p.code).toBe("FLN001");
  });
});
