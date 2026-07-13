import type { Property } from "@/src/domain/property";

export function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    code: "FLN001",
    name: "Apartamento Beira-Mar Florianópolis",
    propertyType: "Apartamento",
    category: "beach",
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    address: {
      street: "Rua Lauro Linhares",
      number: "589",
      complement: "Apto 301",
      neighborhood: "Trindade",
      city: "Florianópolis",
      state: "SC",
      postalCode: "88036-001",
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      {
        url: "https://x.public.blob.vercel-storage.com/properties/FLN001/0.jpg",
        alt: "Apartamento Beira-Mar — foto 1",
        position: 0,
      },
    ],
    access: {
      wifiNetwork: "SeaHome_FLN001",
      wifiPassword: "floripa2024",
      isSelfCheckin: true,
      accessType: "smart_lock",
      accessInstructions: "Use o código 4521 na fechadura eletrônica",
      propertyPassword: "4521",
      hasParkingSpot: true,
      parkingIdentifier: "Vaga 12 — subsolo B1",
      parkingInstructions: "Portão lateral, código 7890 no interfone",
    },
    rules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: false,
    },
    hostName: "Ana Paula",
    hostPhone: "+5548991234567",
    ...overrides,
  };
}
