import { RuleItem } from "@/src/components/molecules/RuleItem";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";
import type { Property } from "@/src/domain/property";

export function RulesSection({ property }: { property: Property }) {
  const r = property.rules;
  return (
    <section>
      <SectionHeader icon="clock" title="Regras da estadia" />
      <div className="grid grid-cols-2 gap-2">
        <RuleItem icon="clock">
          Check-in {r.checkInTime} · Check-out {r.checkOutTime}
        </RuleItem>
        <RuleItem icon="pet">
          {r.allowPet ? "Aceita pets" : "Sem pets"}
        </RuleItem>
        <RuleItem icon="smoking">
          {r.smokingPermitted ? "Fumantes ok" : "Não fumantes"}
        </RuleItem>
        <RuleItem icon="baby">
          {r.suitableForChildren ? "Ok p/ crianças" : "Sem crianças"}
        </RuleItem>
      </div>
    </section>
  );
}
