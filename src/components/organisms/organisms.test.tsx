import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { makeProperty } from "@/src/test/fixtures";
import { PropertyHero } from "@/src/components/organisms/PropertyHero";
import { AccessSection } from "@/src/components/organisms/AccessSection";
import { RulesSection } from "@/src/components/organisms/RulesSection";
import { ContactSection } from "@/src/components/organisms/ContactSection";

const property = makeProperty();

describe("organismos do guia", () => {
  it("PropertyHero mostra nome, localização, fatos e amenidades", () => {
    render(<PropertyHero property={property} />);
    expect(
      screen.getByRole("heading", { name: /Apartamento Beira-Mar/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Trindade · Florianópolis/i)).toBeInTheDocument();
    expect(screen.getByText(/2 quartos/i)).toBeInTheDocument();
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
  });

  it("AccessSection mostra rede e senha do WiFi", () => {
    render(<AccessSection property={property} />);
    expect(screen.getByText("SeaHome_FLN001")).toBeInTheDocument();
    expect(screen.getByText("floripa2024")).toBeInTheDocument();
  });

  it("RulesSection reflete as regras (sem pets, não fumantes, festas/eventos)", () => {
    render(<RulesSection property={property} />);
    expect(screen.getByText(/sem pets/i)).toBeInTheDocument();
    expect(screen.getByText(/não fumantes/i)).toBeInTheDocument();
    expect(screen.getByText(/check-in 15:00/i)).toBeInTheDocument();
    expect(screen.getByText(/sem festas\/eventos/i)).toBeInTheDocument();
  });

  it("ContactSection mostra anfitrião e endereço completo (com CEP)", () => {
    render(<ContactSection property={property} />);
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
    expect(screen.getByText(/Rua Lauro Linhares, 589/i)).toBeInTheDocument();
    expect(screen.getByText(/88036-001/)).toBeInTheDocument();
  });
});
