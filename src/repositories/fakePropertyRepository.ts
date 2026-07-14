import type { Property } from "@/src/domain/property";

export function createFakePropertyRepository(properties: Property[]) {
  return {
    async getByCode(code: string): Promise<Property | null> {
      return properties.find((p) => p.code === code) ?? null;
    },
  };
}
