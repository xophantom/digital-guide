import { describe, it, expect, beforeEach } from "vitest";
import { propertyFacts, nearbyPlacesResult } from "@/src/ai/chatTools";
import { makeProperty } from "@/src/test/fixtures";
import { makeTestDb, type TestDb } from "@/src/test/db";
import { properties } from "@/src/db/schema";
import { createGuideRepository } from "@/src/repositories/guideRepository";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

describe("propertyFacts (valor correto por imóvel)", () => {
  it("FLN001 (allowPet false) indica pets não permitidos", () => {
    expect(propertyFacts(makeProperty()).allowPet).toBe(false);
  });
  it("GRM001-like (allowPet true) indica pets permitidos", () => {
    const grm = makeProperty({ code: "GRM001", rules: { ...makeProperty().rules, allowPet: true } });
    expect(propertyFacts(grm).allowPet).toBe(true);
  });
  it("expõe a senha do WiFi exata", () => {
    expect(propertyFacts(makeProperty()).wifiPassword).toBe("floripa2024");
  });
});

describe("nearbyPlacesResult", () => {
  let db: TestDb;
  let propertyId: string;
  let guideRepo: ReturnType<typeof createGuideRepository>;

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
    guideRepo = createGuideRepository(db);
  });

  it("guia ready → retorna os lugares", async () => {
    await guideRepo.claimForGeneration(propertyId);
    await guideRepo.save(propertyId, FAKE_GUIDE, "m");
    const res = await nearbyPlacesResult(guideRepo, propertyId);
    expect(res.status).toBe("ready");
    expect(res.status === "ready" && res.restaurants.length).toBeGreaterThan(0);
  });

  it("guia pending → 'preparando' (tente em instantes), não erro/vazio", async () => {
    await guideRepo.claimForGeneration(propertyId); // fica 'pending'
    const res = await nearbyPlacesResult(guideRepo, propertyId);
    expect(res.status).toBe("preparando");
    expect(res.status === "preparando" && res.message.length).toBeGreaterThan(0);
  });

  it("guia failed → 'indisponivel' (NÃO diz que está preparando)", async () => {
    await guideRepo.claimForGeneration(propertyId);
    await guideRepo.fail(propertyId, "erro");
    const res = await nearbyPlacesResult(guideRepo, propertyId);
    expect(res.status).toBe("indisponivel");
    expect(res.status === "indisponivel" && res.message.length).toBeGreaterThan(0);
  });
});
