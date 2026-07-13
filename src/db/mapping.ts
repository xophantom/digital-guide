import type { Property } from "@/src/domain/property";
import type {
  properties,
  propertyAccess,
  propertyRules,
  propertyImages,
} from "@/src/db/schema";

type Row = {
  property: typeof properties.$inferSelect;
  access: typeof propertyAccess.$inferSelect;
  rules: typeof propertyRules.$inferSelect;
  images: (typeof propertyImages.$inferSelect)[];
};

export function toProperty({ property, access, rules, images }: Row): Property {
  return {
    id: property.id,
    code: property.code,
    name: property.name,
    propertyType: property.propertyType,
    category: property.category,
    bedroomQuantity: property.bedroomQuantity,
    bathroomQuantity: property.bathroomQuantity,
    guestCapacity: property.guestCapacity,
    address: {
      street: property.street,
      number: property.number,
      complement: property.complement,
      neighborhood: property.neighborhood,
      city: property.city,
      state: property.state,
      postalCode: property.postalCode,
    },
    amenities: property.amenities,
    images: images
      .sort((a, b) => a.position - b.position)
      .map((i) => ({ url: i.url, alt: i.alt, position: i.position })),
    access: {
      wifiNetwork: access.wifiNetwork,
      wifiPassword: access.wifiPassword,
      isSelfCheckin: access.isSelfCheckin,
      accessType: access.accessType,
      accessInstructions: access.accessInstructions,
      propertyPassword: access.propertyPassword,
      hasParkingSpot: access.hasParkingSpot,
      parkingIdentifier: access.parkingIdentifier,
      parkingInstructions: access.parkingInstructions,
    },
    rules: {
      checkInTime: rules.checkInTime,
      checkOutTime: rules.checkOutTime,
      allowPet: rules.allowPet,
      smokingPermitted: rules.smokingPermitted,
      suitableForChildren: rules.suitableForChildren,
      suitableForBabies: rules.suitableForBabies,
      eventsPermitted: rules.eventsPermitted,
    },
    hostName: property.hostName,
    hostPhone: property.hostPhone,
  };
}
