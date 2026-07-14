import { describe, it, expect } from "vitest";
import { buildChatPrompt } from "@/src/ai/prompts/chatPrompt";
import { makeProperty } from "@/src/test/fixtures";

describe("buildChatPrompt", () => {
  const p = buildChatPrompt(makeProperty());
  it("manda usar as tools e não inventar, e cita o anfitrião", () => {
    expect(p).toContain("getPropertyInfo");
    expect(p).toContain("getNearbyPlaces");
    expect(p.toLowerCase()).toMatch(/não invente|nao invente/);
    expect(p).toContain("Ana Paula"); // anfitrião
  });
  it("NÃO embute os dados (a senha do WiFi vem da tool, não do prompt)", () => {
    expect(p).not.toContain("floripa2024");
  });
  it("proíbe emojis nas respostas", () => {
    expect(p.toLowerCase()).toMatch(/não use emojis|nao use emojis|sem emojis/);
  });
});
