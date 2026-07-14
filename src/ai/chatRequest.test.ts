import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import type { UIMessage } from "ai";
import { makeTestDb, type TestDb } from "@/src/test/db";
import { properties, propertyAccess, propertyRules } from "@/src/db/schema";
import { createPropertyRepository } from "@/src/repositories/propertyRepository";
import { createGuideRepository } from "@/src/repositories/guideRepository";
import { handleChatRequest } from "@/src/ai/chatRequest";
import { getAIProvider } from "@/src/ai/provider";

const originalAIProvider = process.env.AI_PROVIDER;
afterEach(() => {
  process.env.AI_PROVIDER = originalAIProvider;
});

let db: TestDb;
beforeEach(async () => {
  db = await makeTestDb();
});

// Insere linha completa (properties + access + rules): getByCode real falha
// se faltar alguma das 1:1.
async function insertProperty(code: string): Promise<void> {
  const [row] = await db
    .insert(properties)
    .values({
      code,
      name: "Apartamento Teste",
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
  await db.insert(propertyAccess).values({
    propertyId: row.id,
    wifiNetwork: "W",
    wifiPassword: "1234",
    isSelfCheckin: true,
    accessType: "smart_lock",
    accessInstructions: "X",
    propertyPassword: null,
    hasParkingSpot: false,
    parkingIdentifier: null,
    parkingInstructions: null,
  });
  await db.insert(propertyRules).values({
    propertyId: row.id,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: true,
    eventsPermitted: false,
  });
}

function userMessage(text: string): UIMessage {
  return { id: "1", role: "user", parts: [{ type: "text", text }] };
}

describe("handleChatRequest (validação do body)", () => {
  it("retorna 400 quando messages está ausente", async () => {
    const propertyRepo = { getByCode: vi.fn() };
    const guideRepo = { get: vi.fn() };

    const response = await handleChatRequest({
      code: "FLN001",
      // @ts-expect-error -- simula body malformado (messages ausente)
      messages: undefined,
      propertyRepo,
      guideRepo,
      provider: getAIProvider(),
    });

    expect(response.status).toBe(400);
    expect(propertyRepo.getByCode).not.toHaveBeenCalled();
  });

  it("retorna 400 quando messages não é um array", async () => {
    const propertyRepo = { getByCode: vi.fn() };
    const guideRepo = { get: vi.fn() };

    const response = await handleChatRequest({
      code: "FLN001",
      // @ts-expect-error -- simula body malformado (messages não é array)
      messages: { role: "user" },
      propertyRepo,
      guideRepo,
      provider: getAIProvider(),
    });

    expect(response.status).toBe(400);
    expect(propertyRepo.getByCode).not.toHaveBeenCalled();
  });

  it("retorna 400 quando messages é um array vazio", async () => {
    const propertyRepo = { getByCode: vi.fn() };
    const guideRepo = { get: vi.fn() };

    const response = await handleChatRequest({
      code: "FLN001",
      messages: [],
      propertyRepo,
      guideRepo,
      provider: getAIProvider(),
    });

    expect(response.status).toBe(400);
    expect(propertyRepo.getByCode).not.toHaveBeenCalled();
  });
});

describe("handleChatRequest", () => {
  it("retorna 404 quando o código não existe", async () => {
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(null) };
    const guideRepo = { get: vi.fn() };

    const response = await handleChatRequest({
      code: "XXX999",
      messages: [userMessage("Oi")],
      propertyRepo,
      guideRepo,
      provider: getAIProvider(),
    });

    expect(response.status).toBe(404);
    expect(guideRepo.get).not.toHaveBeenCalled();
  });

  // NOTA: este teste prova streaming + resolução do imóvel via propertyRepo real
  // (pglite) com o chatModel fake — NÃO exercita tool-calling, pois o
  // MockLanguageModelV4 usado pelo AI_PROVIDER=fake apenas emite texto e nunca
  // decide chamar getPropertyInfo/getNearbyPlaces. O comportamento real de
  // tool-calling é validado pelo e2e da Fase 5.
  it("imóvel semeado + AI_PROVIDER=fake: retorna 200 com stream não vazio", async () => {
    process.env.AI_PROVIDER = "fake";
    await insertProperty("FLN001");
    const propertyRepo = createPropertyRepository(db);
    const guideRepo = createGuideRepository(db);

    const response = await handleChatRequest({
      code: "fln001",
      messages: [userMessage("Qual a senha do wifi?")],
      propertyRepo,
      guideRepo,
      provider: getAIProvider(),
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  });
});
