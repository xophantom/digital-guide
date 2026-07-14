import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";

// Stream parts no formato LanguageModelV4 (v7): finishReason e usage são
// objetos aninhados, não os valores planos do rascunho inicial. Formato
// confirmado no Task 1 e compartilhado por todo mock que precisa emitir um
// objeto pronto através da máquina real de streamObject.
export function objectChunks(obj: unknown): LanguageModelV4StreamPart[] {
  return textChunks(JSON.stringify(obj));
}

// Mesmo formato de objectChunks, mas para texto puro (streamText),
// usado pelo mock de chatModel.
export function textChunks(text: string): LanguageModelV4StreamPart[] {
  return [
    { type: "text-start", id: "1" },
    { type: "text-delta", id: "1", delta: text },
    { type: "text-end", id: "1" },
    {
      type: "finish",
      finishReason: { unified: "stop", raw: undefined },
      usage: {
        inputTokens: { total: 0, noCache: 0, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 0, text: 0, reasoning: 0 },
      },
    },
  ];
}
