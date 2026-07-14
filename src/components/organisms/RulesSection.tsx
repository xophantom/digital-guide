import { Card } from "@/src/components/atoms/Card";
import { Icon } from "@/src/components/atoms/Icon";
import { SectionLabel } from "@/src/components/atoms/SectionLabel";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";
import type { Property } from "@/src/domain/property";

function RuleStatus({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        ok ? "text-emerald-600" : "text-rose-500"
      }`}
    >
      <Icon name={ok ? "check" : "close"} size={14} />
      {ok ? yes : no}
    </span>
  );
}

export function RulesSection({ property }: { property: Property }) {
  const r = property.rules;
  const policies = [
    { label: "Animais de estimação", ok: r.allowPet, yes: "Permitido", no: "Não permitido" },
    { label: "Fumar", ok: r.smokingPermitted, yes: "Permitido", no: "Não permitido" },
    { label: "Crianças", ok: r.suitableForChildren, yes: "Adequado", no: "Não adequado" },
    { label: "Bebês", ok: r.suitableForBabies, yes: "Adequado", no: "Não adequado" },
    { label: "Festas e eventos", ok: r.eventsPermitted, yes: "Permitido", no: "Não permitido" },
  ];
  return (
    <section>
      <SectionHeader icon="clock" title="Regras da estadia" />
      <Card className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-paper px-3 py-2">
            <SectionLabel>Check-in</SectionLabel>
            <p className="mt-0.5 font-mono text-sm text-ink">{r.checkInTime}</p>
          </div>
          <div className="flex-1 rounded-xl bg-paper px-3 py-2">
            <SectionLabel>Check-out</SectionLabel>
            <p className="mt-0.5 font-mono text-sm text-ink">{r.checkOutTime}</p>
          </div>
        </div>
        <ul className="flex flex-col divide-y divide-line">
          {policies.map((p) => (
            <li
              key={p.label}
              className="flex items-center justify-between py-2.5 text-sm text-ink"
            >
              <span>{p.label}</span>
              <RuleStatus ok={p.ok} yes={p.yes} no={p.no} />
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
