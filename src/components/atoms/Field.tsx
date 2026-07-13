import { SectionLabel } from "@/src/components/atoms/SectionLabel";
import { CopyButton } from "@/src/components/atoms/CopyButton";

export function Field({
  label,
  value,
  mono = false,
  copyable = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <div
          className={`mt-1 text-sm text-ink ${
            mono ? "font-(family-name:--font-inter) tracking-tight" : ""
          }`}
        >
          {value}
        </div>
      </div>
      {copyable ? <CopyButton value={value} label={`Copiar ${label}`} /> : null}
    </div>
  );
}
