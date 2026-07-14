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
    expect(
      screen.getByText(/Apartamento · Trindade · Florianópolis/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 quartos/i)).toBeInTheDocument();
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
  });

  it("AccessSection mostra rede e senha do WiFi", () => {
    render(<AccessSection property={property} />);
    expect(screen.getByText("SeaHome_FLN001")).toBeInTheDocument();
    expect(screen.getByText("floripa2024")).toBeInTheDocument();
  });

  it("RulesSection mostra check-in/out e o status de cada política (com bebês e eventos)", () => {
    render(<RulesSection property={property} />);
    expect(screen.getByText("15:00")).toBeInTheDocument();
    expect(screen.getByText("11:00")).toBeInTheDocument();
    expect(screen.getByText("Animais de estimação")).toBeInTheDocument();
    expect(screen.getByText("Bebês")).toBeInTheDocument();
    expect(screen.getByText("Festas e eventos")).toBeInTheDocument();
    // fixture: pets/fumar/festas não permitidos; crianças/bebês adequados
    expect(screen.getAllByText("Não permitido")).toHaveLength(3);
    expect(screen.getAllByText("Adequado")).toHaveLength(2);
  });

  it("ContactSection mostra anfitrião e endereço completo (com CEP)", () => {
    render(<ContactSection property={property} />);
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
    expect(screen.getByText(/Rua Lauro Linhares, 589/i)).toBeInTheDocument();
    expect(screen.getByText(/88036-001/)).toBeInTheDocument();
    const mapEmbed = screen.getByTitle(/mapa/i);
    expect(mapEmbed).toHaveAttribute(
      "src",
      expect.stringContaining("output=embed"),
    );
  });
});
