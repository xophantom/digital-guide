import { Icon } from "@/src/components/atoms/Icon";
import type { IconName } from "@/src/components/icons";

export function RuleItem({
  icon,
  children,
}: {
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 text-sm">
      <Icon name={icon} size={16} className="text-[var(--accent)]" />
      <span>{children}</span>
    </div>
  );
}
