import { describe, it, expect } from "vitest";
import { amenityEntries } from "@/src/components/amenities";

describe("amenityEntries", () => {
  it("retorna só amenidades true e conhecidas, com label e icon", () => {
    const entries = amenityEntries({
      wifi: true,
      tv: false,
      kitchen: true,
      unknown_key: true,
    });
    const keys = entries.map((e) => e.key);
    expect(keys).toContain("wifi");
    expect(keys).toContain("kitchen");
    expect(keys).not.toContain("tv");
    expect(keys).not.toContain("unknown_key");
    expect(entries.find((e) => e.key === "wifi")?.label).toBe("Wi-Fi");
  });
});
