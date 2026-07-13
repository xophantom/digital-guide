import { ICONS, type IconName } from "@/src/components/icons";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
};

export function Icon({ name, size = 18, className, label }: IconProps) {
  const Glyph = ICONS[name];
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true };
  return <Glyph size={size} strokeWidth={1.5} className={className} {...a11y} />;
}
