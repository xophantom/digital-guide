import { Card } from "@/src/components/atoms/Card";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function HostCard({ name, phone }: { name: string; phone: string }) {
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
        <div className="mt-0.5 text-xs text-muted">{phone}</div>
      </div>
    </Card>
  );
}
