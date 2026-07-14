import { propertyRepository, guideRepository } from "@/src/repositories";
import { getAIProvider } from "@/src/ai/provider";
import { getPlacesProvider } from "@/src/places/provider";
import { handleGuideRequest } from "@/src/ai/guideRequest";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  return handleGuideRequest({
    code,
    propertyRepo: propertyRepository,
    guideRepo: guideRepository,
    aiProvider: getAIProvider(),
    placesProvider: getPlacesProvider(),
  });
}
