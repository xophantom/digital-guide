import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { makeProperty } from "@/src/test/fixtures";
import { GuideView } from "@/src/components/templates/GuideView";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";
import type { GuideRecord } from "@/src/repositories/guideRepository";

// guideRecord "ready" evita que o GuideView monte o ExperienceGuideGenerator
// (client, dispara fetch real via useObject) — mantém os testes determinísticos.
const readyGuide: GuideRecord = { status: "ready", guide: FAKE_GUIDE };

describe("GuideView", () => {
  it("aplica data-accent conforme a categoria e mostra o código", () => {
    const { container } = render(
      <GuideView
        property={makeProperty({ category: "mountain" })}
        guideRecord={readyGuide}
      />,
    );
    expect(container.querySelector("[data-accent='green']")).not.toBeNull();
    expect(screen.getByText("FLN001")).toBeInTheDocument();
  });

  it("renderiza todas as seções (hero, acesso, regras, experiências, contato)", () => {
    render(
      <GuideView property={makeProperty()} guideRecord={readyGuide} />,
    );
    expect(screen.getByText(/Acesso & WiFi/i)).toBeInTheDocument();
    expect(screen.getByText(/Regras da estadia/i)).toBeInTheDocument();
    expect(screen.getByText(/Guia de Experiências/i)).toBeInTheDocument();
    expect(screen.getByText(/Contato/i)).toBeInTheDocument();
    expect(screen.getByText("floripa2024")).toBeInTheDocument();
  });

  it("renderiza sem quebrar quando não há imagens e campos opcionais são nulos", () => {
    render(
      <GuideView
        property={makeProperty({
          images: [],
          access: {
            wifiNetwork: "SeaHome_FLN001",
            wifiPassword: "floripa2024",
            isSelfCheckin: true,
            accessType: "smart_lock",
            accessInstructions: "Use o código 4521 na fechadura eletrônica",
            propertyPassword: "4521",
            hasParkingSpot: false,
            parkingIdentifier: null,
            parkingInstructions: null,
          },
          address: {
            street: "Rua Lauro Linhares",
            number: "589",
            complement: null,
            neighborhood: "Trindade",
            city: "Florianópolis",
            state: "SC",
            postalCode: "88036-001",
          },
        })}
        guideRecord={readyGuide}
      />,
    );
    expect(screen.getByText(/Contato/i)).toBeInTheDocument();
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
  });
});
