import { Icon } from "@/src/components/atoms/Icon";
import type { IconName } from "@/src/components/icons";

export function SectionHeader({
  icon,
  title,
  badge,
}: {
  icon: IconName;
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon name={icon} size={18} className="text-(--accent)" />
        <h2 className="font-display text-lg tracking-tight">{title}</h2>
      </div>
      {badge}
    </div>
  );
}
