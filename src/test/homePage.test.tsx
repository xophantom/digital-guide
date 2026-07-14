import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { SEED_PROPERTIES } from "@/src/db/seed-data";

describe("home", () => {
  it("lista todos os imóveis do seed, cada um com link para /<code>", () => {
    render(<Home />);
    for (const p of SEED_PROPERTIES) {
      const link = screen.getByRole("link", { name: new RegExp(p.code) });
      expect(link).toHaveAttribute("href", `/${p.code}`);
    }
    expect(screen.getAllByRole("link")).toHaveLength(SEED_PROPERTIES.length);
  });
});
