import { db } from "@/src/db/client";
import { createPropertyRepository } from "@/src/repositories/propertyRepository";
import { createGuideRepository } from "@/src/repositories/guideRepository";

export const propertyRepository = createPropertyRepository(db);
export const guideRepository = createGuideRepository(db);
