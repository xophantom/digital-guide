import type { createPropertyRepository } from "@/src/repositories/propertyRepository";
import type { createGuideRepository } from "@/src/repositories/guideRepository";
import { streamGuide, streamPersistedGuide } from "@/src/ai/generateGuide";
import type { AIProvider } from "@/src/ai/provider";
import type { PlacesProvider } from "@/src/places/provider";

export type PropertyRepo = ReturnType<typeof createPropertyRepository>;
export type GuideRepo = ReturnType<typeof createGuideRepository>;

// Caminho perdedor: intervalo entre tentativas e prazo máximo de espera pelo vencedor do claim.
// POLL_TIMEOUT_MS precisa ser >= ao limiar de stale-claim de 90s (guideRepository.ts,
// claimForGeneration) e folgado o bastante para uma geração real do model terminar —
// caso contrário o perdedor cai em 503 antes do vencedor sequer estourar o próprio prazo
// de claim, mesmo quando a geração está progredindo normalmente.
export const POLL_INTERVAL_MS = 1_000;
export const POLL_TIMEOUT_MS = 95_000;

export async function handleGuideRequest({
  code,
  propertyRepo,
  guideRepo,
  aiProvider,
  placesProvider,
}: {
  code: string;
  propertyRepo: PropertyRepo;
  guideRepo: GuideRepo;
  aiProvider: AIProvider;
  placesProvider: PlacesProvider;
}): Promise<Response> {
  const property = await propertyRepo.getByCode(code.toUpperCase());
  if (!property) return new Response("Imóvel não encontrado", { status: 404 });

  const existing = await guideRepo.get(property.id);
  if (existing?.status === "ready" && existing.guide) {
    return streamPersistedGuide(existing.guide).toTextStreamResponse();
  }

  const won = await guideRepo.claimForGeneration(property.id);
  if (won) {
    // ORDEM OBRIGATÓRIA: só busca lugares (rede externa) depois de vencer o
    // claim — evita gastar Nominatim/Overpass em requests concorrentes que
    // vão perder a corrida de qualquer forma.
    const places = await placesProvider.findNearby(property.address);
    return streamGuide({
      property,
      places,
      provider: aiProvider,
      repo: guideRepo,
      persist: true,
    }).toTextStreamResponse();
  }

  // Perdeu o claim: aguarda o vencedor terminar consultando só o banco
  // (nunca placesProvider nem qualquer rede externa).
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const rec = await guideRepo.get(property.id);
    if (rec?.status === "ready" && rec.guide) {
      return streamPersistedGuide(rec.guide).toTextStreamResponse();
    }
    if (rec?.status === "failed") break;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  return new Response("A geração falhou. Tente novamente.", { status: 503 });
}
