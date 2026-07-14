import { Card } from "@/src/components/atoms/Card";
import { Field } from "@/src/components/atoms/Field";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";
import { HostCard } from "@/src/components/molecules/HostCard";
import type { Property } from "@/src/domain/property";

export function ContactSection({ property }: { property: Property }) {
  const ad = property.address;
  const line1 = `${ad.street}, ${ad.number}${
    ad.complement ? ` · ${ad.complement}` : ""
  }`;
  const line2 = `${ad.neighborhood}, ${ad.city} — ${ad.state} · CEP ${ad.postalCode}`;
  return (
    <section>
      <SectionHeader icon="phone" title="Contato" />
      <div className="flex flex-col gap-3">
        <HostCard name={property.hostName} phone={property.hostPhone} />
        <Card>
          <Field label="Endereço" value={`${line1} · ${line2}`} />
        </Card>
      </div>
    </section>
  );
}
