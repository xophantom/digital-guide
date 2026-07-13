import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb, type TestDb } from "@/src/test/db";
import {
  properties,
  propertyAccess,
  propertyRules,
} from "@/src/db/schema";
import { createPropertyRepository } from "@/src/repositories/propertyRepository";

let db: TestDb;

async function insertFln(): Promise<void> {
  const [row] = await db
    .insert(properties)
    .values({
      code: "FLN001",
      name: "Apartamento Beira-Mar",
      propertyType: "Apartamento",
      category: "beach",
      bedroomQuantity: 2,
      bathroomQuantity: 1,
      guestCapacity: 4,
      street: "Rua Lauro Linhares",
      number: "589",
      complement: "Apto 301",
      neighborhood: "Trindade",
      city: "Florianópolis",
      state: "SC",
      postalCode: "88036-001",
      amenities: { wifi: true },
      hostName: "Ana Paula",
      hostPhone: "+5548991234567",
    })
    .returning();
  await db.insert(propertyAccess).values({
    propertyId: row.id,
    wifiNetwork: "SeaHome_FLN001",
    wifiPassword: "floripa2024",
    isSelfCheckin: true,
    accessType: "smart_lock",
    accessInstructions: "Código 4521",
    propertyPassword: "4521",
    hasParkingSpot: true,
    parkingIdentifier: "Vaga 12",
    parkingInstructions: "Portão lateral",
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

beforeEach(async () => {
  db = await makeTestDb();
});

describe("propertyRepository.getByCode", () => {
  it("retorna a propriedade agregada quando existe", async () => {
    await insertFln();
    const repo = createPropertyRepository(db);
    const property = await repo.getByCode("FLN001");
    expect(property?.name).toBe("Apartamento Beira-Mar");
    expect(property?.access.wifiPassword).toBe("floripa2024");
    expect(property?.rules.allowPet).toBe(false);
    expect(property?.category).toBe("beach");
  });

  it("retorna null quando o código não existe", async () => {
    const repo = createPropertyRepository(db);
    expect(await repo.getByCode("XXX999")).toBeNull();
  });

  it("retorna null quando faltam as linhas 1:1 de acesso/regras", async () => {
    await db.insert(properties).values({
      code: "PARTIAL1",
      name: "Sem relações",
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
    });
    const repo = createPropertyRepository(db);
    expect(await repo.getByCode("PARTIAL1")).toBeNull();
  });
});
