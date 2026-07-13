import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { makeProperty } from "@/src/test/fixtures";
import { GuideView } from "@/src/components/templates/GuideView";

describe("GuideView", () => {
  it("aplica data-accent conforme a categoria e mostra o código", () => {
    const { container } = render(
      <GuideView property={makeProperty({ category: "mountain" })} />,
    );
    expect(container.querySelector("[data-accent='green']")).not.toBeNull();
    expect(screen.getByText("FLN001")).toBeInTheDocument();
  });

  it("renderiza todas as seções (hero, acesso, regras, contato)", () => {
    render(<GuideView property={makeProperty()} />);
    expect(screen.getByText(/Acesso & WiFi/i)).toBeInTheDocument();
    expect(screen.getByText(/Regras da estadia/i)).toBeInTheDocument();
    expect(screen.getByText(/Contato/i)).toBeInTheDocument();
    expect(screen.getByText("floripa2024")).toBeInTheDocument();
  });
});
