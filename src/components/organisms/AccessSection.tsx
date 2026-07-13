import { Card } from "@/src/components/atoms/Card";
import { Field } from "@/src/components/atoms/Field";
import { SectionHeader } from "@/src/components/molecules/SectionHeader";
import type { Property } from "@/src/domain/property";

export function AccessSection({ property }: { property: Property }) {
  const a = property.access;
  return (
    <section>
      <SectionHeader icon="key" title="Acesso & WiFi" />
      <div className="flex flex-col gap-3">
        <Card className="flex flex-col gap-3">
          <Field label="Rede WiFi" value={a.wifiNetwork} mono />
          <Field label="Senha" value={a.wifiPassword} mono copyable />
        </Card>
        <Card>
          <Field label="Entrada" value={a.accessInstructions} />
        </Card>
        {a.hasParkingSpot ? (
          <Card>
            <Field
              label="Estacionamento"
              value={[a.parkingIdentifier, a.parkingInstructions]
                .filter(Boolean)
                .join(" · ")}
            />
          </Card>
        ) : null}
      </div>
    </section>
  );
}
