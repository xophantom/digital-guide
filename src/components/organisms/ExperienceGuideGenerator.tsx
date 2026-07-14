"use client";

import { useEffect } from "react";
import { useObject } from "@ai-sdk/react";
import type { DeepPartial } from "ai";
import {
  experienceGuideSchema,
  type ExperienceGuide as ExperienceGuideData,
} from "@/src/domain/guide";
import {
  AiBadge,
  ExperienceGroup,
  SeasonalTip,
  ExperienceGuide,
} from "@/src/components/organisms/ExperienceGuide";
import { ExperienceGuideSkeleton } from "@/src/components/organisms/ExperienceGuideSkeleton";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";

type PartialGuide = DeepPartial<ExperienceGuideData>;
type PartialPlace = { name?: string; distance?: string; description?: string };

// Só é dado como pronto quando bate com o schema completo — evita renderizar
// o organismo "puro" com campos ainda faltando no meio do streaming.
function isReady(partial: PartialGuide | undefined): partial is ExperienceGuideData {
  return experienceGuideSchema.safeParse(partial).success;
}

function isCompletePlace(
  place: PartialPlace | undefined,
): place is { name: string; distance: string; description: string } {
  return !!place?.name && !!place?.distance && !!place?.description;
}

function PartialExperienceGuide({ partial }: { partial: PartialGuide }) {
  const restaurants = (partial.restaurants ?? []).filter(isCompletePlace);
  const attractions = (partial.attractions ?? []).filter(isCompletePlace);
  const essentials = (partial.essentials ?? []).filter(isCompletePlace);
  const hasAnyGroup =
    restaurants.length > 0 || attractions.length > 0 || essentials.length > 0;

  return (
    <section>
      <SectionHeader
        icon="sparkles"
        title="Guia de Experiências"
        badge={<AiBadge />}
      />
      {partial.welcomeMessage ? (
        <p className="font-display text-base italic leading-relaxed text-ink/80">
          {partial.welcomeMessage}
        </p>
      ) : (
        <div className="h-4 w-full animate-pulse rounded bg-line" />
      )}
      <ExperienceGroup label="Restaurantes" icon="restaurant" items={restaurants} />
      <ExperienceGroup label="Atrações" icon="attraction" items={attractions} />
      <ExperienceGroup label="Essenciais" icon="essential" items={essentials} />
      {!hasAnyGroup ? (
        <div className="mt-4 flex flex-col gap-2">
          <div className="h-14 animate-pulse rounded-2xl bg-line" />
          <div className="h-14 animate-pulse rounded-2xl bg-line" />
        </div>
      ) : null}
      {partial.seasonalTips ? (
        <SeasonalTip>{partial.seasonalTips}</SeasonalTip>
      ) : (
        <div className="mt-4 h-16 animate-pulse rounded-2xl bg-line" />
      )}
    </section>
  );
}

export function ExperienceGuideGenerator({ code }: { code: string }) {
  const { object, submit, error } = useObject({
    api: `/api/properties/${code}/guide`,
    schema: experienceGuideSchema,
  });

  useEffect(() => {
    submit(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dispara só na 1ª visita; submit muda de referência a cada render.
  }, []);

  if (error) {
    return (
      <section>
        <SectionHeader
          icon="sparkles"
          title="Guia de Experiências"
          badge={<AiBadge />}
        />
        <div className="rounded-2xl border border-line bg-card p-4 text-sm text-muted">
          Não foi possível gerar o guia agora.
        </div>
        <button
          type="button"
          onClick={() => submit(undefined)}
          className="mt-3 rounded-full bg-(--accent) px-4 py-2 text-xs font-semibold text-white"
        >
          Tentar de novo
        </button>
      </section>
    );
  }

  if (isReady(object)) {
    return <ExperienceGuide guide={object} />;
  }

  if (object) {
    return <PartialExperienceGuide partial={object} />;
  }

  // Sem conteúdo ainda: skeleton tanto durante o fetch quanto antes do 1º chunk chegar.
  return <ExperienceGuideSkeleton />;
}
