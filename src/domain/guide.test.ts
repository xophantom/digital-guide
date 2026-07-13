import { describe, it, expect } from "vitest";
import { experienceGuideSchema } from "@/src/domain/guide";

const valid = {
  welcomeMessage: "Bem-vindo à Trindade!",
  restaurants: [
    { name: "Box 32", distance: "1,2 km", description: "Petiscos." },
  ],
  attractions: [
    { name: "Praia da Joaquina", distance: "18 km", description: "Surf." },
  ],
  essentials: [
    {
      name: "Farmácia Catarinense",
      type: "pharmacy",
      distance: "300 m",
      description: "24h.",
    },
  ],
  seasonalTips: "Leve agasalho.",
};

describe("experienceGuideSchema", () => {
  it("valida um guia bem formado", () => {
    expect(experienceGuideSchema.parse(valid)).toMatchObject(valid);
  });

  it("rejeita quando falta welcomeMessage", () => {
    const { welcomeMessage, ...rest } = valid;
    expect(() => experienceGuideSchema.parse(rest)).toThrow();
  });
});
