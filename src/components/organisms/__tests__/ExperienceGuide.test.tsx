import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceGuide } from "@/src/components/organisms/ExperienceGuide";
import { ExperienceGuideSkeleton } from "@/src/components/organisms/ExperienceGuideSkeleton";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

describe("ExperienceGuide", () => {
  it("mostra boas-vindas, ao menos um restaurante e a dica sazonal", () => {
    render(<ExperienceGuide guide={FAKE_GUIDE} />);
    expect(screen.getByText(FAKE_GUIDE.welcomeMessage)).toBeInTheDocument();
    expect(screen.getByText(FAKE_GUIDE.restaurants[0].name)).toBeInTheDocument();
    expect(screen.getByText(FAKE_GUIDE.seasonalTips)).toBeInTheDocument();
  });

  it("mostra o badge gerado por IA e os grupos de atrações e essenciais", () => {
    render(<ExperienceGuide guide={FAKE_GUIDE} />);
    expect(screen.getByText(/gerado por IA/i)).toBeInTheDocument();
    expect(screen.getByText(FAKE_GUIDE.attractions[0].name)).toBeInTheDocument();
    expect(screen.getByText(FAKE_GUIDE.essentials[0].name)).toBeInTheDocument();
  });
});

describe("ExperienceGuideSkeleton", () => {
  it("monta sem quebrar", () => {
    render(<ExperienceGuideSkeleton />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
