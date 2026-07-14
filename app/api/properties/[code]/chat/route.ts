import type { UIMessage } from "ai";
import { propertyRepository, guideRepository } from "@/src/repositories";
import { getAIProvider } from "@/src/ai/provider";
import { handleChatRequest } from "@/src/ai/chatRequest";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  let messages: UIMessage[];
  try {
    const body: unknown = await req.json();
    // body pode ser JSON válido e ainda assim não ser um objeto (ex.: null),
    // então o formato precisa ser checado antes de desestruturar.
    if (typeof body !== "object" || body === null) {
      return new Response("Requisição inválida", { status: 400 });
    }
    ({ messages } = body as { messages: UIMessage[] });
  } catch {
    return new Response("Requisição inválida", { status: 400 });
  }
  return handleChatRequest({
    code,
    messages,
    propertyRepo: propertyRepository,
    guideRepo: guideRepository,
    provider: getAIProvider(),
  });
}
