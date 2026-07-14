import { describe, it, expect } from "vitest";
import { buildGuidePrompt } from "@/src/ai/prompts/guidePrompt";
import { makeProperty } from "@/src/test/fixtures";
import { FAKE_NEARBY } from "@/src/places/fakePlaces";
import type { NearbyPlaces } from "@/src/places/types";

const property = makeProperty();
const now = new Date("2026-07-13T12:00:00Z");

describe("buildGuidePrompt", () => {
  it("ancora no endereço e lista os restaurantes reais fornecidos", () => {
    const { system, prompt } = buildGuidePrompt(property, FAKE_NEARBY, now);
    expect(prompt).toContain("Florianópolis");
    expect(prompt).toContain(FAKE_NEARBY.restaurants[0].name);
    expect(system.toLowerCase()).toMatch(/não invente|nao invente|descreva/);
  });

  it("cai no fallback (sugerir) quando uma categoria vem vazia", () => {
    const empty: NearbyPlaces = { restaurants: [], attractions: [], pharmacies: [], markets: [], hospitals: [] };
    const { prompt } = buildGuidePrompt(property, empty, now);
    expect(prompt.toLowerCase()).toMatch(/sugira|sugerir/);
  });

  it("passa a referência sazonal (julho → inverno no Brasil)", () => {
    const { prompt } = buildGuidePrompt(property, FAKE_NEARBY, now);
    expect(prompt.toLowerCase()).toMatch(/julho|inverno/);
  });
});
