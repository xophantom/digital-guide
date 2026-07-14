import { Icon } from "@/src/components/atoms/Icon";
import { SectionLabel } from "@/src/components/atoms/SectionLabel";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";
import { ExperienceCard } from "@/src/components/molecules/ExperienceCard";
import type { ExperienceGuide as ExperienceGuideData } from "@/src/domain/guide";
import type { IconName } from "@/src/components/icons";

type Place = { name: string; distance: string; description: string };

export function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-(--accent-soft) px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-(--accent)">
      <Icon name="sparkles" size={12} />
      gerado por IA
    </span>
  );
}

export function ExperienceGroup({
  label,
  icon,
  items,
}: {
  label: string;
  icon: IconName;
  items: Place[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, index) => (
          <ExperienceCard
            key={`${item.name}-${index}`}
            icon={icon}
            name={item.name}
            distance={item.distance}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

export function SeasonalTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-line bg-(--accent-soft) p-4 text-sm leading-relaxed text-ink/80">
      {children}
    </div>
  );
}

export function ExperienceGuide({ guide }: { guide: ExperienceGuideData }) {
  return (
    <section>
      <SectionHeader
        icon="sparkles"
        title="Guia de Experiências"
        badge={<AiBadge />}
      />
      <p className="font-display text-base italic leading-relaxed text-ink/80">
        {guide.welcomeMessage}
      </p>
      <ExperienceGroup
        label="Restaurantes"
        icon="restaurant"
        items={guide.restaurants}
      />
      <ExperienceGroup
        label="Atrações"
        icon="attraction"
        items={guide.attractions}
      />
      <ExperienceGroup
        label="Essenciais"
        icon="essential"
        items={guide.essentials}
      />
      <SeasonalTip>{guide.seasonalTips}</SeasonalTip>
    </section>
  );
}
