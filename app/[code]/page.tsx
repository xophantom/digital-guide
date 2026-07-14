import { notFound } from "next/navigation";
import { propertyRepository, guideRepository } from "@/src/repositories";
import { GuideView } from "@/src/components/templates/GuideView";

export const dynamic = "force-dynamic";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const property = await propertyRepository.getByCode(code.toUpperCase());
  if (!property) notFound();
  const guideRecord = await guideRepository.get(property.id);
  return <GuideView property={property} guideRecord={guideRecord} />;
}
