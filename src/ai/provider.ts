import { anthropic } from "@ai-sdk/anthropic";
import { simulateReadableStream, type LanguageModel } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";
import { objectChunks, textChunks } from "@/src/ai/mockStream";

export type AIProvider = { guideModel: LanguageModel; chatModel: LanguageModel };

// Modelo usado quando AI_MODEL_GUIDE não está configurado.
export const DEFAULT_GUIDE_MODEL = "claude-opus-4-8";

// Modelo usado quando AI_MODEL_CHAT não está configurado.
export const DEFAULT_CHAT_MODEL = "claude-sonnet-5";

// Mock que emite o FAKE_GUIDE como um único bloco de texto JSON, passando
// pela máquina real de streamObject (formato de stream part em src/ai/mockStream.ts).
function fakeGuideModel(): LanguageModel {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: objectChunks(FAKE_GUIDE) }),
    }),
  });
}

// Mock que emite uma resposta de texto curta e determinística, passando
// pela máquina real de streamText.
function fakeChatModel(): LanguageModel {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({ chunks: textChunks("Resposta de teste.") }),
    }),
  });
}

export function getAIProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "fake") {
    return { guideModel: fakeGuideModel(), chatModel: fakeChatModel() };
  }
  return {
    guideModel: anthropic(process.env.AI_MODEL_GUIDE ?? DEFAULT_GUIDE_MODEL),
    chatModel: anthropic(process.env.AI_MODEL_CHAT ?? DEFAULT_CHAT_MODEL),
  };
}
