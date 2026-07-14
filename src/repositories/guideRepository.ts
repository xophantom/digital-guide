import { eq, or, and, lt } from "drizzle-orm";
import type { RepoDb } from "@/src/db/client";
import { experienceGuides } from "@/src/db/schema";
import type { ExperienceGuide, GuideStatus } from "@/src/domain/guide";

export type GuideRecord = {
  status: GuideStatus;
  guide: ExperienceGuide | null;
};

export function createGuideRepository(db: RepoDb) {
  return {
    async get(propertyId: string): Promise<GuideRecord | null> {
      const [row] = await db
        .select()
        .from(experienceGuides)
        .where(eq(experienceGuides.propertyId, propertyId));
      if (!row) return null;
      const guide =
        row.status === "ready" &&
        row.welcomeMessage &&
        row.restaurants &&
        row.attractions &&
        row.essentials &&
        row.seasonalTips
          ? {
              welcomeMessage: row.welcomeMessage,
              restaurants: row.restaurants,
              attractions: row.attractions,
              essentials: row.essentials,
              seasonalTips: row.seasonalTips,
            }
          : null;
      return { status: row.status, guide };
    },

    // Claim atômico: vence se a linha não existe, está 'failed' ou 'pending' travada (crash/timeout).
    async claimForGeneration(propertyId: string): Promise<boolean> {
      const staleThreshold = new Date(Date.now() - 90_000);
      const rows = await db
        .insert(experienceGuides)
        .values({ propertyId, status: "pending", claimedAt: new Date() })
        .onConflictDoUpdate({
          target: experienceGuides.propertyId,
          set: { status: "pending", claimedAt: new Date(), error: null },
          setWhere: or(
            eq(experienceGuides.status, "failed"),
            and(eq(experienceGuides.status, "pending"), lt(experienceGuides.claimedAt, staleThreshold)),
          ),
        })
        .returning({ propertyId: experienceGuides.propertyId });
      return rows.length > 0;
    },

    async save(
      propertyId: string,
      guide: ExperienceGuide,
      model: string,
    ): Promise<void> {
      await db
        .update(experienceGuides)
        .set({
          status: "ready",
          welcomeMessage: guide.welcomeMessage,
          restaurants: guide.restaurants,
          attractions: guide.attractions,
          essentials: guide.essentials,
          seasonalTips: guide.seasonalTips,
          model,
          error: null,
          generatedAt: new Date(),
        })
        .where(eq(experienceGuides.propertyId, propertyId));
    },

    async fail(propertyId: string, error: string): Promise<void> {
      await db
        .update(experienceGuides)
        .set({ status: "failed", error })
        .where(eq(experienceGuides.propertyId, propertyId));
    },
  };
}
