import { db } from "@/src/db/client";
import { createPropertyRepository } from "@/src/repositories/propertyRepository";
import { createGuideRepository } from "@/src/repositories/guideRepository";
import { createFakePropertyRepository } from "@/src/repositories/fakePropertyRepository";
import { createFakeGuideRepository } from "@/src/repositories/fakeGuideRepository";
import { FAKE_PROPERTIES } from "@/src/repositories/fakeData";

const fake = process.env.DATA_PROVIDER === "fake";

export const propertyRepository = fake
  ? createFakePropertyRepository(FAKE_PROPERTIES)
  : createPropertyRepository(db);

export const guideRepository = fake
  ? createFakeGuideRepository()
  : createGuideRepository(db);
