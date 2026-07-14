import { describe, it, expect } from "vitest";
import { createFakePropertyRepository } from "@/src/repositories/fakePropertyRepository";
import { FAKE_PROPERTIES } from "@/src/repositories/fakeData";

describe("createFakePropertyRepository", () => {
  const repo = createFakePropertyRepository(FAKE_PROPERTIES);
  it("acha por código", async () => {
    expect((await repo.getByCode("FLN001"))?.code).toBe("FLN001");
  });
  it("retorna null pra código inexistente", async () => {
    expect(await repo.getByCode("XXX999")).toBeNull();
  });
});
