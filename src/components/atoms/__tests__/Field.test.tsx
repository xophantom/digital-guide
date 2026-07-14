import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "@/src/components/atoms/Field";

describe("Field", () => {
  it("mostra rótulo e valor", () => {
    render(<Field label="Rede WiFi" value="SeaHome_FLN001" />);
    expect(screen.getByText("Rede WiFi")).toBeInTheDocument();
    expect(screen.getByText("SeaHome_FLN001")).toBeInTheDocument();
  });

  it("renderiza botão de copiar quando copyable", () => {
    render(<Field label="Senha" value="floripa2024" copyable />);
    expect(
      screen.getByRole("button", { name: /copiar/i }),
    ).toBeInTheDocument();
  });
});
