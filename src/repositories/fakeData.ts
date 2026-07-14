import type { Property } from "@/src/domain/property";
import { SEED_PROPERTIES } from "@/src/db/seed-data";

export const FAKE_PROPERTIES: Property[] = SEED_PROPERTIES.map((p) => ({
  id: `fake-${p.code}`,
  code: p.code,
  name: p.name,
  propertyType: p.propertyType,
  category: p.category,
  bedroomQuantity: p.bedroomQuantity,
  bathroomQuantity: p.bathroomQuantity,
  guestCapacity: p.guestCapacity,
  address: p.address,
  amenities: p.amenities,
  images: p.imageSources.map((url, i) => ({ url, alt: `${p.name} — foto ${i + 1}`, position: i })),
  access: p.access,
  rules: p.rules,
  hostName: p.hostName,
  hostPhone: p.hostPhone,
}));
