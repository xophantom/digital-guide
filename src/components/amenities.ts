import type { IconName } from "@/src/components/icons";

export const AMENITY_META: Record<string, { label: string; icon: IconName }> = {
  wifi: { label: "Wi-Fi", icon: "wifi" },
  tv: { label: "TV", icon: "tv" },
  air_conditioning: { label: "Ar-condicionado", icon: "ac" },
  kitchen: { label: "Cozinha", icon: "kitchen" },
  washing_machine: { label: "Lavadora", icon: "washer" },
  dishwasher: { label: "Lava-louças", icon: "kitchen" },
  elevator: { label: "Elevador", icon: "elevator" },
  balcony: { label: "Sacada", icon: "balcony" },
  bbq_grill: { label: "Churrasqueira", icon: "grill" },
};

export function amenityEntries(
  amenities: Record<string, boolean>,
): { key: string; label: string; icon: IconName }[] {
  return Object.entries(amenities)
    .filter(([key, on]) => on && key in AMENITY_META)
    .map(([key]) => ({ key, ...AMENITY_META[key] }));
}
