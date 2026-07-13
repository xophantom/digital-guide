import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { PropertyCategory } from "@/src/theme/accent";
import type { GuideStatus } from "@/src/domain/guide";
import type { ExperienceGuide } from "@/src/domain/guide";

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  propertyType: text("property_type").notNull(),
  category: text("category").$type<PropertyCategory>().notNull(),
  bedroomQuantity: integer("bedroom_quantity").notNull(),
  bathroomQuantity: integer("bathroom_quantity").notNull(),
  guestCapacity: integer("guest_capacity").notNull(),
  street: text("street").notNull(),
  number: text("number").notNull(),
  complement: text("complement"),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  amenities: jsonb("amenities").$type<Record<string, boolean>>().notNull(),
  hostName: text("host_name").notNull(),
  hostPhone: text("host_phone").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const propertyAccess = pgTable("property_access", {
  propertyId: uuid("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),
  wifiNetwork: text("wifi_network").notNull(),
  wifiPassword: text("wifi_password").notNull(),
  isSelfCheckin: boolean("is_self_checkin").notNull(),
  accessType: text("access_type").notNull(),
  accessInstructions: text("access_instructions").notNull(),
  propertyPassword: text("property_password"),
  hasParkingSpot: boolean("has_parking_spot").notNull(),
  parkingIdentifier: text("parking_identifier"),
  parkingInstructions: text("parking_instructions"),
});

export const propertyRules = pgTable("property_rules", {
  propertyId: uuid("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),
  checkInTime: text("check_in_time").notNull(),
  checkOutTime: text("check_out_time").notNull(),
  allowPet: boolean("allow_pet").notNull(),
  smokingPermitted: boolean("smoking_permitted").notNull(),
  suitableForChildren: boolean("suitable_for_children").notNull(),
  suitableForBabies: boolean("suitable_for_babies").notNull(),
  eventsPermitted: boolean("events_permitted").notNull(),
});

export const propertyImages = pgTable("property_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  position: integer("position").notNull(),
});

export const experienceGuides = pgTable("experience_guides", {
  propertyId: uuid("property_id")
    .primaryKey()
    .references(() => properties.id, { onDelete: "cascade" }),
  status: text("status").$type<GuideStatus>().notNull(),
  welcomeMessage: text("welcome_message"),
  seasonalTips: text("seasonal_tips"),
  restaurants: jsonb("restaurants").$type<ExperienceGuide["restaurants"]>(),
  attractions: jsonb("attractions").$type<ExperienceGuide["attractions"]>(),
  essentials: jsonb("essentials").$type<ExperienceGuide["essentials"]>(),
  model: text("model"),
  error: text("error"),
  generatedAt: timestamp("generated_at"),
});
