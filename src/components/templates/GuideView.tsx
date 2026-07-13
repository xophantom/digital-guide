import { accentForCategory } from "@/src/theme/accent";
import { PropertyHero } from "@/src/components/organisms/PropertyHero";
import { AccessSection } from "@/src/components/organisms/AccessSection";
import { RulesSection } from "@/src/components/organisms/RulesSection";
import { ContactSection } from "@/src/components/organisms/ContactSection";
import type { Property } from "@/src/domain/property";

export function GuideView({ property }: { property: Property }) {
  return (
    <div data-accent={accentForCategory(property.category)}>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/80 px-5 py-3 backdrop-blur">
        <span className="font-display text-sm">
          <b className="font-semibold">Seazone</b> · Guia do Hóspede
        </span>
        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[var(--accent)]">
          {property.code}
        </span>
      </header>
      <main className="mx-auto flex max-w-xl flex-col gap-8 px-5 pb-16 pt-6">
        <PropertyHero property={property} />
        <AccessSection property={property} />
        <RulesSection property={property} />
        <ContactSection property={property} />
      </main>
    </div>
  );
}
