import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb, type TestDb } from "@/src/test/db";
import { properties } from "@/src/db/schema";
import { createGuideRepository } from "@/src/repositories/guideRepository";
import type { ExperienceGuide } from "@/src/domain/guide";

let db: TestDb;
let propertyId: string;

const guide: ExperienceGuide = {
  welcomeMessage: "Olá!",
  restaurants: [{ name: "Box 32", distance: "1,2 km", description: "Petiscos." }],
  attractions: [{ name: "Joaquina", distance: "18 km", description: "Surf." }],
  essentials: [
    { name: "Farmácia", type: "pharmacy", distance: "300 m", description: "24h." },
  ],
  seasonalTips: "Leve agasalho.",
};

beforeEach(async () => {
  db = await makeTestDb();
  const [row] = await db
    .insert(properties)
    .values({
      code: "FLN001",
      name: "X",
      propertyType: "Apartamento",
      category: "beach",
      bedroomQuantity: 1,
      bathroomQuantity: 1,
      guestCapacity: 2,
      street: "R",
      number: "1",
      complement: null,
      neighborhood: "N",
      city: "C",
      state: "SC",
      postalCode: "0",
      amenities: {},
      hostName: "H",
      hostPhone: "P",
    })
    .returning();
  propertyId = row.id;
});

describe("guideRepository", () => {
  it("claim só é vencido por um chamador concorrente", async () => {
    const repo = createGuideRepository(db);
    const [a, b] = await Promise.all([
      repo.claim(propertyId),
      repo.claim(propertyId),
    ]);
    expect([a, b].filter(Boolean)).toHaveLength(1);
  });

  it("save grava status ready e get devolve o guia", async () => {
    const repo = createGuideRepository(db);
    await repo.claim(propertyId);
    await repo.save(propertyId, guide, "claude-opus-4-8");
    const record = await repo.get(propertyId);
    expect(record?.status).toBe("ready");
    expect(record?.guide?.restaurants[0].name).toBe("Box 32");
  });

  it("fail grava status failed", async () => {
    const repo = createGuideRepository(db);
    await repo.claim(propertyId);
    await repo.fail(propertyId, "timeout");
    const record = await repo.get(propertyId);
    expect(record?.status).toBe("failed");
  });
});
