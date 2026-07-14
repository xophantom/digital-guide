import { anthropic } from "@ai-sdk/anthropic";
import { simulateReadableStream, type LanguageModel } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";
import { objectChunks } from "@/src/ai/mockStream";

export type AIProvider = { guideModel: LanguageModel };

// Modelo usado quando AI_MODEL_GUIDE não está configurado.
export const DEFAULT_GUIDE_MODEL = "claude-opus-4-8";

// Mock que emite o FAKE_GUIDE como um único bloco de texto JSON, passando
// pela máquina real de streamObject (formato de stream part em src/ai/mockStream.ts).
function fakeGuideModel(): LanguageModel {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: objectChunks(FAKE_GUIDE) }),
    }),
  });
}

export function getAIProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "fake") {
    return { guideModel: fakeGuideModel() };
  }
  return { guideModel: anthropic(process.env.AI_MODEL_GUIDE ?? DEFAULT_GUIDE_MODEL) };
}
