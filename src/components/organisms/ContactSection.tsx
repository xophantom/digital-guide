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
  const mapsQuery = encodeURIComponent(
    `${ad.street}, ${ad.number} - ${ad.neighborhood}, ${ad.city} - ${ad.state}, ${ad.postalCode}`,
  );
  return (
    <section>
      <SectionHeader icon="phone" title="Contato" />
      <div className="flex flex-col gap-3">
        <HostCard name={property.hostName} phone={property.hostPhone} />
        <Card className="flex flex-col gap-3">
          <Field label="Endereço" value={`${line1} · ${line2}`} />
          <iframe
            src={`https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`}
            title={`Mapa — ${line1}`}
            loading="lazy"
            className="h-44 w-full rounded-xl border border-line"
          />
        </Card>
      </div>
    </section>
  );
}
