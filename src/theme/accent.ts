export type PropertyCategory = "beach" | "mountain" | "city";
export type AccentKey = "teal" | "green" | "clay";

const MAP: Record<PropertyCategory, AccentKey> = {
  beach: "teal",
  mountain: "green",
  city: "clay",
};

export function accentForCategory(category: PropertyCategory): AccentKey {
  return MAP[category];
}
