import { Card } from "@/src/components/atoms/Card";
import { Icon } from "@/src/components/atoms/Icon";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function HostCard({ name, phone }: { name: string; phone: string }) {
  const digits = phone.replace(/\D/g, "");
  return (
    <Card className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--accent) font-semibold text-white">
        {initials(name)}
      </div>
      <div>
        <div className="text-sm font-semibold">
          {name}{" "}
          <span className="text-xs font-normal text-muted">· Anfitrião</span>
        </div>
        <a
          href={`https://wa.me/${digits}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp de ${name}`}
          className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-(--accent)"
        >
          <Icon name="chat" size={13} />
          {phone}
        </a>
      </div>
    </Card>
  );
}
