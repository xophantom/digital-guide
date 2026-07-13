import { eq } from "drizzle-orm";
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

    // Claim atômico: só um chamador insere a linha 'pending'.
    async claim(propertyId: string): Promise<boolean> {
      const inserted = await db
        .insert(experienceGuides)
        .values({ propertyId, status: "pending" })
        .onConflictDoNothing({ target: experienceGuides.propertyId })
        .returning({ propertyId: experienceGuides.propertyId });
      return inserted.length > 0;
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
