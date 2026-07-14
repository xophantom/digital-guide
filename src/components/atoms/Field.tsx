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
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-1 flex items-center gap-2">
        <span className={`text-sm text-ink ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
        {copyable ? (
          <CopyButton value={value} label={`Copiar ${label}`} />
        ) : null}
      </div>
    </div>
  );
}
