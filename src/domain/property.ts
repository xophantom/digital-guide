import type { PropertyCategory } from "@/src/theme/accent";

export type Address = {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
};

export type PropertyAccess = {
  wifiNetwork: string;
  wifiPassword: string;
  isSelfCheckin: boolean;
  accessType: string;
  accessInstructions: string;
  propertyPassword: string | null;
  hasParkingSpot: boolean;
  parkingIdentifier: string | null;
  parkingInstructions: string | null;
};

export type PropertyRules = {
  checkInTime: string;
  checkOutTime: string;
  allowPet: boolean;
  smokingPermitted: boolean;
  suitableForChildren: boolean;
  suitableForBabies: boolean;
  eventsPermitted: boolean;
};

export type PropertyImage = { url: string; alt: string; position: number };

export type Property = {
  id: string;
  code: string;
  name: string;
  propertyType: string;
  category: PropertyCategory;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
  address: Address;
  amenities: Record<string, boolean>;
  images: PropertyImage[];
  access: PropertyAccess;
  rules: PropertyRules;
  hostName: string;
  hostPhone: string;
};
