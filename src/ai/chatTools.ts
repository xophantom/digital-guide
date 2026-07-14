import { tool } from "ai";
import { z } from "zod";
import type { Property } from "@/src/domain/property";
import type { ExperienceGuide } from "@/src/domain/guide";

export type PropertyFacts = {
  wifiNetwork: string;
  wifiPassword: string;
  checkInTime: string;
  checkOutTime: string;
  allowPet: boolean;
  smokingPermitted: boolean;
  suitableForChildren: boolean;
  suitableForBabies: boolean;
  eventsPermitted: boolean;
  accessInstructions: string;
  parking: string | null;
  hostName: string;
  hostPhone: string;
};

export function propertyFacts(p: Property): PropertyFacts {
  const ac = p.access,
    r = p.rules;
  return {
    wifiNetwork: ac.wifiNetwork,
    wifiPassword: ac.wifiPassword,
    checkInTime: r.checkInTime,
    checkOutTime: r.checkOutTime,
    allowPet: r.allowPet,
    smokingPermitted: r.smokingPermitted,
    suitableForChildren: r.suitableForChildren,
    suitableForBabies: r.suitableForBabies,
    eventsPermitted: r.eventsPermitted,
    accessInstructions: ac.accessInstructions,
    parking: ac.hasParkingSpot
      ? [ac.parkingIdentifier, ac.parkingInstructions].filter(Boolean).join(" — ")
      : null,
    hostName: p.hostName,
    hostPhone: p.hostPhone,
  };
}

type NearbyResult =
  | {
      status: "ready";
      restaurants: ExperienceGuide["restaurants"];
      attractions: ExperienceGuide["attractions"];
      essentials: ExperienceGuide["essentials"];
    }
  | { status: "preparando"; message: string }
  | { status: "indisponivel"; message: string };

type GuideRepoLike = {
  get(id: string): Promise<{ status: string; guide: ExperienceGuide | null } | null>;
};

export async function nearbyPlacesResult(
  guideRepo: GuideRepoLike,
  propertyId: string,
): Promise<NearbyResult> {
  const rec = await guideRepo.get(propertyId);
  if (rec?.status === "ready" && rec.guide) {
    return {
      status: "ready",
      restaurants: rec.guide.restaurants,
      attractions: rec.guide.attractions,
      essentials: rec.guide.essentials,
    };
  }
  if (rec?.status === "pending") {
    return {
      status: "preparando",
      message: "O guia de experiências ainda está sendo preparado. Peça ao hóspede para tentar novamente em instantes.",
    };
  }
  // failed OU ausente → NÃO mentir dizendo que está preparando.
  return {
    status: "indisponivel",
    message: "Não consegui carregar as recomendações da região agora, mas posso ajudar com os dados do imóvel.",
  };
}

export function buildChatTools({
  property,
  guideRepo,
}: {
  property: Property;
  guideRepo: GuideRepoLike;
}) {
  return {
    getPropertyInfo: tool({
      // LIMITE explícito: fatos DENTRO do imóvel (não lugares da região).
      description:
        "Fatos DENTRO do imóvel: WiFi (rede/senha), horários de check-in/out, regras (pets, fumantes, crianças, eventos), instruções de acesso, estacionamento e contato do anfitrião. Chame para perguntas sobre o próprio imóvel — NÃO para lugares na região.",
      inputSchema: z.object({}),
      execute: async () => propertyFacts(property),
    }),
    getNearbyPlaces: tool({
      // LIMITE explícito: lugares FORA do imóvel (região).
      description:
        "Lugares FORA do imóvel, próximos: restaurantes, atrações e serviços/essenciais do guia de experiências. Chame para perguntas sobre onde comer, o que fazer ou serviços na região. Pode retornar que o guia ainda está sendo preparado ou indisponível — nesse caso, siga a mensagem retornada.",
      inputSchema: z.object({}),
      execute: async () => nearbyPlacesResult(guideRepo, property.id),
    }),
  };
}
