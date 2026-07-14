import { describe, it, expect } from "vitest";
import { createFakeGuideRepository } from "@/src/repositories/fakeGuideRepository";
import type { ExperienceGuide } from "@/src/domain/guide";

const guide: ExperienceGuide = {
  welcomeMessage: "Olá!",
  restaurants: [{ name: "Box 32", distance: "1,2 km", description: "Petiscos." }],
  attractions: [{ name: "Joaquina", distance: "18 km", description: "Surf." }],
  essentials: [
    { name: "Farmácia", type: "pharmacy", distance: "300 m", description: "24h." },
  ],
  seasonalTips: "Leve agasalho.",
};

describe("createFakeGuideRepository", () => {
  it("get devolve null quando não há registro", async () => {
    const repo = createFakeGuideRepository();
    expect(await repo.get("p1")).toBeNull();
  });

  it("claimForGeneration vence quando não há registro", async () => {
    const repo = createFakeGuideRepository();
    expect(await repo.claimForGeneration("p1")).toBe(true);
  });

  it("claimForGeneration perde quando já está pending", async () => {
    const repo = createFakeGuideRepository();
    await repo.claimForGeneration("p1");
    expect(await repo.claimForGeneration("p1")).toBe(false);
  });

  it("claimForGeneration revence quando o status é failed", async () => {
    const repo = createFakeGuideRepository();
    await repo.claimForGeneration("p1");
    await repo.fail("p1", "erro");
    expect(await repo.claimForGeneration("p1")).toBe(true);
  });

  it("claimForGeneration perde quando o status é ready", async () => {
    const repo = createFakeGuideRepository();
    await repo.claimForGeneration("p1");
    await repo.save("p1", guide, "m");
    expect(await repo.claimForGeneration("p1")).toBe(false);
  });

  it("save grava status ready e get devolve o guia", async () => {
    const repo = createFakeGuideRepository();
    await repo.claimForGeneration("p1");
    await repo.save("p1", guide, "claude-opus-4-8");
    const record = await repo.get("p1");
    expect(record?.status).toBe("ready");
    expect(record?.guide?.restaurants[0].name).toBe("Box 32");
  });

  it("fail grava status failed e get não devolve guia", async () => {
    const repo = createFakeGuideRepository();
    await repo.claimForGeneration("p1");
    await repo.fail("p1", "timeout");
    const record = await repo.get("p1");
    expect(record?.status).toBe("failed");
    expect(record?.guide).toBeNull();
  });
});
