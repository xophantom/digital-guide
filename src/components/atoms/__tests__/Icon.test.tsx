import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "@/src/components/atoms/Icon";

describe("Icon", () => {
  it("renderiza um svg com aria-hidden por padrão", () => {
    const { container } = render(<Icon name="wifi" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("expõe label acessível quando fornecido", () => {
    const { getByLabelText } = render(<Icon name="wifi" label="Wi-Fi" />);
    expect(getByLabelText("Wi-Fi")).toBeInTheDocument();
  });
});
