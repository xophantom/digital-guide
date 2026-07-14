import { describe, it, expect } from "vitest";
import { accentForCategory } from "@/src/theme/accent";

describe("accentForCategory", () => {
  it("mapeia praia para teal", () => {
    expect(accentForCategory("beach")).toBe("teal");
  });
  it("mapeia serra para green", () => {
    expect(accentForCategory("mountain")).toBe("green");
  });
  it("mapeia capital para clay", () => {
    expect(accentForCategory("city")).toBe("clay");
  });
});
