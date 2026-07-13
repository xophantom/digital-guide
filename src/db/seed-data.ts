import type { PropertyCategory } from "@/src/theme/accent";

export type SeedProperty = {
  code: string;
  name: string;
  propertyType: string;
  category: PropertyCategory;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
  address: {
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  amenities: Record<string, boolean>;
  access: {
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
  rules: {
    checkInTime: string;
    checkOutTime: string;
    allowPet: boolean;
    smokingPermitted: boolean;
    suitableForChildren: boolean;
    suitableForBabies: boolean;
    eventsPermitted: boolean;
  };
  hostName: string;
  hostPhone: string;
  imageSources: string[];
};

export const SEED_PROPERTIES: SeedProperty[] = [
  {
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
    imageSources: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
    ],
  },
  {
    code: "GRM001",
    name: "Chalé Serra Gramado",
    propertyType: "Casa",
    category: "mountain",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    address: {
      street: "Rua das Hortênsias",
      number: "220",
      complement: null,
      neighborhood: "Planalto",
      city: "Gramado",
      state: "RS",
      postalCode: "95670-000",
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbq_grill: true,
      balcony: true,
      dishwasher: true,
    },
    access: {
      wifiNetwork: "ChaletSerra_GRM",
      wifiPassword: "gramado@2024",
      isSelfCheckin: false,
      accessType: "keybox",
      accessInstructions: "A chave está no cofre na entrada. Código: 1983",
      propertyPassword: "1983",
      hasParkingSpot: true,
      parkingIdentifier: null,
      parkingInstructions: "Garagem própria para 2 carros",
    },
    rules: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    hostName: "Carlos Eduardo",
    hostPhone: "+5554998765432",
    imageSources: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
    ],
  },
  {
    code: "RIO001",
    name: "Studio Vista Copacabana",
    propertyType: "Studio",
    category: "city",
    bedroomQuantity: 1,
    bathroomQuantity: 1,
    guestCapacity: 2,
    address: {
      street: "Avenida Atlântica",
      number: "1702",
      complement: "Apto 904",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      postalCode: "22021-001",
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      elevator: true,
      pool: true,
      gym: true,
    },
    access: {
      wifiNetwork: "CopaStudio_RIO001",
      wifiPassword: "riodejaneiro24",
      isSelfCheckin: true,
      accessType: "smart_lock",
      accessInstructions: "Digite o código 6630 no teclado da porta",
      propertyPassword: "6630",
      hasParkingSpot: false,
      parkingIdentifier: null,
      parkingInstructions: null,
    },
    rules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      allowPet: false,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    hostName: "Beatriz Nogueira",
    hostPhone: "+5521987654321",
    imageSources: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200",
      "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1200",
    ],
  },
  {
    code: "UBA001",
    name: "Casa de Praia Ubatuba",
    propertyType: "Casa",
    category: "beach",
    bedroomQuantity: 4,
    bathroomQuantity: 3,
    guestCapacity: 8,
    address: {
      street: "Rua das Toninhas",
      number: "145",
      complement: null,
      neighborhood: "Praia das Toninhas",
      city: "Ubatuba",
      state: "SP",
      postalCode: "11680-000",
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbq_grill: true,
      pool: true,
      hot_tub: false,
      garden: true,
    },
    access: {
      wifiNetwork: "CasaToninhas_UBA",
      wifiPassword: "ubatuba2024",
      isSelfCheckin: false,
      accessType: "host_greeting",
      accessInstructions:
        "O anfitrião ou o caseiro Sr. José aguarda na chegada para entregar as chaves",
      propertyPassword: null,
      hasParkingSpot: true,
      parkingIdentifier: null,
      parkingInstructions: "Portão automático, controle disponível na entrada",
    },
    rules: {
      checkInTime: "16:00",
      checkOutTime: "12:00",
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: true,
      eventsPermitted: true,
    },
    hostName: "Fernando Ramos",
    hostPhone: "+5512998877665",
    imageSources: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
    ],
  },
  {
    code: "CPD001",
    name: "Chalé Alpino Campos do Jordão",
    propertyType: "Casa",
    category: "mountain",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 5,
    address: {
      street: "Avenida Emilio Ribas",
      number: "860",
      complement: null,
      neighborhood: "Vila Capivari",
      city: "Campos do Jordão",
      state: "SP",
      postalCode: "12460-000",
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      fireplace: true,
      heating: true,
      bbq_grill: true,
    },
    access: {
      wifiNetwork: "AlpinoCPD_001",
      wifiPassword: "camposjordao24",
      isSelfCheckin: false,
      accessType: "keybox",
      accessInstructions: "A chave está no cofre ao lado da porta. Código: 5147",
      propertyPassword: "5147",
      hasParkingSpot: true,
      parkingIdentifier: null,
      parkingInstructions: "Garagem coberta para 1 carro",
    },
    rules: {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      allowPet: true,
      smokingPermitted: false,
      suitableForChildren: true,
      suitableForBabies: false,
      eventsPermitted: false,
    },
    hostName: "Marina Salles",
    hostPhone: "+5512991122334",
    imageSources: [
      "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=1200",
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200",
    ],
  },
];
