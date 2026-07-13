import { streamObject, simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { experienceGuideSchema, type ExperienceGuide } from "@/src/domain/guide";
import { buildGuidePrompt } from "@/src/ai/prompts/guidePrompt";
import { objectChunks } from "@/src/ai/mockStream";
import type { Property } from "@/src/domain/property";
import type { NearbyPlaces } from "@/src/places/types";
import type { AIProvider } from "@/src/ai/provider";

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
  return streamObject({
    model: provider.guideModel,
    schema: experienceGuideSchema,
    system,
    prompt,
    onFinish: async ({ object, error }) => {
      if (!persist) return;
      if (object) {
        await repo.save(property.id, object, process.env.AI_MODEL_GUIDE ?? "claude-opus-4-8");
      } else {
        await repo.fail(property.id, String(error ?? "geração falhou"));
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
