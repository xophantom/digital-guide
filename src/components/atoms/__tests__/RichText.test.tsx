import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RichText } from "@/src/components/atoms/RichText";

describe("RichText", () => {
  it("renderiza **negrito** como <strong> e não vaza asteriscos", () => {
    const { container } = render(
      <RichText text="A rede é **SeaHome_FLN001** e a senha é **floripa2024**." />,
    );
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(2);
    expect(strongs[0]).toHaveTextContent("SeaHome_FLN001");
    expect(strongs[1]).toHaveTextContent("floripa2024");
    expect(container.textContent).toBe(
      "A rede é SeaHome_FLN001 e a senha é floripa2024.",
    );
    expect(container.textContent).not.toContain("*");
  });

  it("texto sem marcação passa intacto, sem <strong>", () => {
    const { container } = render(<RichText text="Olá, tudo bem?" />);
    expect(container.textContent).toBe("Olá, tudo bem?");
    expect(container.querySelector("strong")).toBeNull();
  });
});
