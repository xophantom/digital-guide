import { streamObject, simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { experienceGuideSchema, type ExperienceGuide } from "@/src/domain/guide";
import { buildGuidePrompt } from "@/src/ai/prompts/guidePrompt";
import { objectChunks } from "@/src/ai/mockStream";
import type { Property } from "@/src/domain/property";
import type { NearbyPlaces } from "@/src/places/types";
import { DEFAULT_GUIDE_MODEL, type AIProvider } from "@/src/ai/provider";

export type GuidePersistRepo = {
  save: (propertyId: string, guide: ExperienceGuide, model: string) => Promise<void>;
  fail: (propertyId: string, error: string) => Promise<void>;
};

export function streamGuide({
  property,
  places,
  provider,
  repo,
  persist,
}: {
  property: Property;
  places: NearbyPlaces;
  provider: AIProvider;
  repo: GuidePersistRepo;
  persist: boolean;
}) {
  const { system, prompt } = buildGuidePrompt(property, places, new Date());

  // onFinish (falha de validação de schema) e onError (falha da própria
  // chamada ao model, ex.: doStream rejeitando por rede/401/429) são classes
  // de falha distintas e, na prática, mutuamente exclusivas — mas o flag
  // abaixo garante que repo.fail nunca seja chamado duas vezes para a mesma
  // geração, caso as duas rotas acabem se sobrepondo.
  let failed = false;
  const persistFailure = async (error: unknown) => {
    if (!persist || failed) return;
    failed = true;
    await repo.fail(property.id, String(error ?? "geração falhou"));
  };

  return streamObject({
    model: provider.guideModel,
    schema: experienceGuideSchema,
    system,
    prompt,
    // Dispara quando a chamada ao model falha (network, 401, 429, timeout).
    // Sem isso, esse tipo de falha nunca chega ao onFinish: o registro fica
    // "pending" para sempre e result.object nunca resolve.
    onError: async ({ error }) => {
      await persistFailure(error);
    },
    onFinish: async ({ object, error }) => {
      if (!persist) return;
      if (object) {
        await repo.save(property.id, object, process.env.AI_MODEL_GUIDE ?? DEFAULT_GUIDE_MODEL);
      } else {
        await persistFailure(error);
      }
    },
  });
}

// Re-emite um guia já persistido através da mesma máquina de streamObject
// (útil para clientes que perderam o claim ou já têm o guia pronto).
export function streamPersistedGuide(guide: ExperienceGuide) {
  const model = new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: objectChunks(guide) }),
    }),
  });
  return streamObject({ model, schema: experienceGuideSchema, prompt: "" });
}
