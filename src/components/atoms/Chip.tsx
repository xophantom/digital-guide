import { Icon } from "@/src/components/atoms/Icon";
import type { IconName } from "@/src/components/icons";

export function Chip({
  icon,
  children,
}: {
  icon?: IconName;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-xs text-ink/80">
      {icon ? <Icon name={icon} size={14} /> : null}
      {children}
    </span>
  );
}
