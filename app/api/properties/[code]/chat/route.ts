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
  const { messages }: { messages: UIMessage[] } = await req.json();
  return handleChatRequest({
    code,
    messages,
    propertyRepo: propertyRepository,
    guideRepo: guideRepository,
    provider: getAIProvider(),
  });
}
