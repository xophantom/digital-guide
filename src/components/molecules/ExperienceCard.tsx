import { Card } from "@/src/components/atoms/Card";
import { Icon } from "@/src/components/atoms/Icon";
import type { IconName } from "@/src/components/icons";

export function ExperienceCard({
  icon,
  name,
  distance,
  description,
}: {
  icon: IconName;
  name: string;
  distance: string;
  description: string;
}) {
  return (
    <Card className="flex items-start gap-3">
      <Icon name={icon} size={16} className="mt-0.5 shrink-0 text-(--accent)" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span className="whitespace-nowrap text-[10.5px] font-semibold text-(--accent)">
            {distance}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
    </Card>
  );
}
