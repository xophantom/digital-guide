import type { ExperienceGuide, GuideStatus } from "@/src/domain/guide";
import type { GuideRecord } from "@/src/repositories/guideRepository";

type Entry = {
  status: GuideStatus;
  guide: ExperienceGuide | null;
  error: string | null;
};

// Fake em memória: sem staleness (não há "pending travado" a expirar).
export function createFakeGuideRepository() {
  const store = new Map<string, Entry>();

  return {
    async get(propertyId: string): Promise<GuideRecord | null> {
      const entry = store.get(propertyId);
      if (!entry) return null;
      return { status: entry.status, guide: entry.status === "ready" ? entry.guide : null };
    },

    async claimForGeneration(propertyId: string): Promise<boolean> {
      const entry = store.get(propertyId);
      if (entry && (entry.status === "pending" || entry.status === "ready")) return false;
      store.set(propertyId, { status: "pending", guide: null, error: null });
      return true;
    },

    async save(propertyId: string, guide: ExperienceGuide, model: string): Promise<void> {
      void model; // fake não persiste o model — parâmetro só espelha a assinatura do repo real
      store.set(propertyId, { status: "ready", guide, error: null });
    },

    async fail(propertyId: string, error: string): Promise<void> {
      store.set(propertyId, { status: "failed", guide: null, error });
    },
  };
}
