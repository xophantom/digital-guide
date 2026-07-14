import {
  streamText,
  stepCountIs,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai";
import type { UIMessage } from "ai";
import { buildChatPrompt } from "@/src/ai/prompts/chatPrompt";
import { buildChatTools } from "@/src/ai/chatTools";
import type { AIProvider } from "@/src/ai/provider";
import type { Property } from "@/src/domain/property";
import type { ExperienceGuide } from "@/src/domain/guide";

export type PropertyRepo = { getByCode(code: string): Promise<Property | null> };
export type GuideRepo = {
  get(id: string): Promise<{ status: string; guide: ExperienceGuide | null } | null>;
};

export async function handleChatRequest({
  code,
  messages,
  propertyRepo,
  guideRepo,
  provider,
}: {
  code: string;
  messages: UIMessage[];
  propertyRepo: PropertyRepo;
  guideRepo: GuideRepo;
  provider: AIProvider;
}): Promise<Response> {
  const property = await propertyRepo.getByCode(code.toUpperCase());
  if (!property) return new Response("Imóvel não encontrado", { status: 404 });

  const result = streamText({
    model: provider.chatModel,
    system: buildChatPrompt(property),
    messages: await convertToModelMessages(messages),
    tools: buildChatTools({ property, guideRepo }),
    // 3 passos: até 2 chamadas de tool + a resposta final em texto, com folga
    // para limitar um loop acidental de tool-call sem travar o fluxo normal.
    stopWhen: stepCountIs(3),
  });

  // result.toUIMessageStreamResponse() existe mas está deprecated na v7
  // instalada (remoção prevista pra próxima major) — os docs versionados
  // (node_modules/ai/docs/04-ai-sdk-ui/03-chatbot-tool-usage.mdx) recomendam
  // esta forma explícita para o caso de multi-step com tools no servidor.
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
