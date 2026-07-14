import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { makeTestDb, type TestDb } from "@/src/test/db";
import { properties, propertyAccess, propertyRules } from "@/src/db/schema";
import { createGuideRepository } from "@/src/repositories/guideRepository";
import { handleGuideRequest, POLL_INTERVAL_MS, POLL_TIMEOUT_MS } from "@/src/ai/guideRequest";
import { getAIProvider } from "@/src/ai/provider";
import { makeProperty } from "@/src/test/fixtures";
import { FAKE_NEARBY } from "@/src/places/fakePlaces";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

const originalAIProvider = process.env.AI_PROVIDER;
afterEach(() => {
  process.env.AI_PROVIDER = originalAIProvider;
  vi.useRealTimers();
});

let db: TestDb;
beforeEach(async () => {
  db = await makeTestDb();
});

// Insere linha completa (properties + access + rules) para permitir uso do
// propertyRepository real (getByCode falha se faltar alguma das 1:1).
async function insertProperty(code: string): Promise<string> {
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
  return row.id;
}

const spyPlaces = () => ({ findNearby: vi.fn().mockResolvedValue(FAKE_NEARBY) });

describe("handleGuideRequest", () => {
  it("retorna 404 quando o código não existe", async () => {
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(null) };
    const guideRepo = {
      get: vi.fn(),
      claimForGeneration: vi.fn(),
      save: vi.fn(),
      fail: vi.fn(),
    };
    const placesProvider = spyPlaces();

    const response = await handleGuideRequest({
      code: "XXX999",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    expect(response.status).toBe(404);
    expect(placesProvider.findNearby).not.toHaveBeenCalled();
  });

  it("vence o claim: busca lugares, gera e persiste um guia a partir de um stream não vazio", async () => {
    process.env.AI_PROVIDER = "fake";
    const propertyId = await insertProperty("FLN001");
    const guideRepo = createGuideRepository(db);
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(makeProperty({ id: propertyId, code: "FLN001" })) };
    const placesProvider = spyPlaces();

    const response = await handleGuideRequest({
      code: "FLN001",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);

    expect(placesProvider.findNearby).toHaveBeenCalledTimes(1);
    expect(placesProvider.findNearby).toHaveBeenCalledWith(
      expect.objectContaining({ city: "Florianópolis" }),
    );

    const record = await guideRepo.get(propertyId);
    expect(record?.status).toBe("ready");
    expect(record?.guide?.restaurants.length).toBe(FAKE_GUIDE.restaurants.length);
  });

  it("perde o claim: NÃO chama placesProvider e faz poll só no banco até o guia ficar pronto", async () => {
    let getCalls = 0;
    const guideRepo = {
      // 1ª chamada: checagem inicial de "já está ready?" -> ainda pending.
      // 2ª chamada: dentro do loop de poll -> já ficou ready (vencedor terminou).
      get: vi.fn(async () => {
        getCalls += 1;
        if (getCalls === 1) return { status: "pending" as const, guide: null };
        return { status: "ready" as const, guide: FAKE_GUIDE };
      }),
      claimForGeneration: vi.fn().mockResolvedValue(false),
      save: vi.fn(),
      fail: vi.fn(),
    };
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(makeProperty()) };
    const placesProvider = spyPlaces();

    const response = await handleGuideRequest({
      code: "FLN001",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);

    expect(guideRepo.claimForGeneration).toHaveBeenCalledTimes(1);
    expect(placesProvider.findNearby).not.toHaveBeenCalled();
  });

  it("POLL_TIMEOUT_MS cobre o limiar de stale-claim de 90s do guideRepository", () => {
    // Regressão do bug: um POLL_TIMEOUT_MS menor que o stale-claim de 90s
    // (guideRepository.claimForGeneration) faz o perdedor desistir (503) antes
    // do vencedor sequer estourar o próprio prazo de claim.
    expect(POLL_TIMEOUT_MS).toBeGreaterThanOrEqual(90_000);
  });

  it("perde o claim e faz poll (com temporizadores falsos) até o vencedor marcar 'ready'", async () => {
    vi.useFakeTimers();
    let getCalls = 0;
    const guideRepo = {
      // 1ª chamada: checagem inicial de "já está ready?" -> pending.
      // 2ª e 3ª chamadas: dentro do loop de poll -> ainda pending.
      // 4ª chamada: o vencedor terminou -> ready.
      get: vi.fn(async () => {
        getCalls += 1;
        if (getCalls <= 3) return { status: "pending" as const, guide: null };
        return { status: "ready" as const, guide: FAKE_GUIDE };
      }),
      claimForGeneration: vi.fn().mockResolvedValue(false),
      save: vi.fn(),
      fail: vi.fn(),
    };
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(makeProperty()) };
    const placesProvider = spyPlaces();

    const responsePromise = handleGuideRequest({
      code: "FLN001",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    // Avança o suficiente para percorrer as iterações de poll sem esperar
    // segundos reais — cada iteração dorme POLL_INTERVAL_MS entre tentativas.
    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 5);

    const response = await responsePromise;
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);

    expect(guideRepo.claimForGeneration).toHaveBeenCalledTimes(1);
    expect(placesProvider.findNearby).not.toHaveBeenCalled();
  });

  it("perde o claim e o vencedor marca 'failed': retorna 503 sem streamar nada persistido", async () => {
    vi.useFakeTimers();
    let getCalls = 0;
    const guideRepo = {
      // 1ª chamada: checagem inicial -> pending. 2ª: 1ª iteração do loop -> ainda
      // pending. 3ª: o vencedor desistiu -> failed, o loop deve parar aqui.
      get: vi.fn(async () => {
        getCalls += 1;
        if (getCalls <= 2) return { status: "pending" as const, guide: null };
        return { status: "failed" as const, guide: null };
      }),
      claimForGeneration: vi.fn().mockResolvedValue(false),
      save: vi.fn(),
      fail: vi.fn(),
    };
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(makeProperty()) };
    const placesProvider = spyPlaces();

    const responsePromise = handleGuideRequest({
      code: "FLN001",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    await vi.advanceTimersByTimeAsync(POLL_INTERVAL_MS * 5);

    const response = await responsePromise;
    expect(response.status).toBe(503);
    expect(placesProvider.findNearby).not.toHaveBeenCalled();
  });

  it("guia já pronto: retorna direto do banco sem reclamar geração nem chamar placesProvider", async () => {
    const guideRepo = {
      get: vi.fn().mockResolvedValue({ status: "ready" as const, guide: FAKE_GUIDE }),
      claimForGeneration: vi.fn(),
      save: vi.fn(),
      fail: vi.fn(),
    };
    const propertyRepo = { getByCode: vi.fn().mockResolvedValue(makeProperty()) };
    const placesProvider = spyPlaces();

    const response = await handleGuideRequest({
      code: "FLN001",
      propertyRepo,
      guideRepo,
      aiProvider: getAIProvider(),
      placesProvider,
    });

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
    expect(guideRepo.claimForGeneration).not.toHaveBeenCalled();
    expect(placesProvider.findNearby).not.toHaveBeenCalled();
  });
});
