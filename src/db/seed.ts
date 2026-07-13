import "dotenv/config";
import { put } from "@vercel/blob";
import { db } from "@/src/db/client";
import {
  properties,
  propertyAccess,
  propertyRules,
  propertyImages,
} from "@/src/db/schema";
import { SEED_PROPERTIES } from "@/src/db/seed-data";

async function uploadImage(code: string, url: string, i: number): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  const { url: blobUrl } = await put(`properties/${code}/${i}.jpg`, blob, {
    access: "public",
    contentType: "image/jpeg",
  });
  return blobUrl;
}

async function seed(): Promise<void> {
  for (const p of SEED_PROPERTIES) {
    const [row] = await db
      .insert(properties)
      .values({
        code: p.code,
        name: p.name,
        propertyType: p.propertyType,
        category: p.category,
        bedroomQuantity: p.bedroomQuantity,
        bathroomQuantity: p.bathroomQuantity,
        guestCapacity: p.guestCapacity,
        street: p.address.street,
        number: p.address.number,
        complement: p.address.complement,
        neighborhood: p.address.neighborhood,
        city: p.address.city,
        state: p.address.state,
        postalCode: p.address.postalCode,
        amenities: p.amenities,
        hostName: p.hostName,
        hostPhone: p.hostPhone,
      })
      .returning();

    await db.insert(propertyAccess).values({ propertyId: row.id, ...p.access });
    await db.insert(propertyRules).values({ propertyId: row.id, ...p.rules });

    for (let i = 0; i < p.imageSources.length; i++) {
      const url = await uploadImage(p.code, p.imageSources[i], i);
      await db.insert(propertyImages).values({
        propertyId: row.id,
        url,
        alt: `${p.name} — foto ${i + 1}`,
        position: i,
      });
    }
    console.log(`seeded ${p.code}`);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
