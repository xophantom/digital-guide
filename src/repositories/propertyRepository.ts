import { eq } from "drizzle-orm";
import type { RepoDb } from "@/src/db/client";
import {
  properties,
  propertyAccess,
  propertyRules,
  propertyImages,
} from "@/src/db/schema";
import { toProperty } from "@/src/db/mapping";
import type { Property } from "@/src/domain/property";

export function createPropertyRepository(db: RepoDb) {
  return {
    async getByCode(code: string): Promise<Property | null> {
      const [property] = await db
        .select()
        .from(properties)
        .where(eq(properties.code, code));
      if (!property) return null;

      const [access] = await db
        .select()
        .from(propertyAccess)
        .where(eq(propertyAccess.propertyId, property.id));
      const [rules] = await db
        .select()
        .from(propertyRules)
        .where(eq(propertyRules.propertyId, property.id));
      if (!access || !rules) return null;

      const images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, property.id));

      return toProperty({ property, access, rules, images });
    },
  };
}
