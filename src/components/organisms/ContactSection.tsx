import { Card } from "@/src/components/atoms/Card";
import { Field } from "@/src/components/atoms/Field";
import { Icon } from "@/src/components/atoms/Icon";
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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  return (
    <section>
      <SectionHeader icon="phone" title="Contato" />
      <div className="flex flex-col gap-3">
        <HostCard name={property.hostName} phone={property.hostPhone} />
        <Card className="flex flex-col gap-2">
          <Field label="Endereço" value={`${line1} · ${line2}`} />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-2.5 py-1.5 text-[11px] font-semibold text-(--accent)"
          >
            <Icon name="pin" size={13} />
            Abrir no Maps
          </a>
        </Card>
      </div>
    </section>
  );
}
