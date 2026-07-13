import { anthropic } from "@ai-sdk/anthropic";
import { simulateReadableStream, type LanguageModel } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

export type AIProvider = { guideModel: LanguageModel };

// Mock que emite o FAKE_GUIDE como um único bloco de texto JSON, passando
// pela máquina real de streamObject (LanguageModelV4StreamPart da v7 instalada:
// finishReason e usage são objetos, não os valores planos do rascunho inicial).
function fakeGuideModel(): LanguageModel {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "1" },
          { type: "text-delta", id: "1", delta: JSON.stringify(FAKE_GUIDE) },
          { type: "text-end", id: "1" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: undefined },
            usage: {
              inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 0, text: 0, reasoning: 0 },
            },
          },
        ],
      }),
    }),
  });
}

export function getAIProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "fake") {
    return { guideModel: fakeGuideModel() };
  }
  return { guideModel: anthropic(process.env.AI_MODEL_GUIDE ?? "claude-opus-4-8") };
}
