import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhotoGallery } from "@/src/components/molecules/PhotoGallery";

const IMAGES = [
  { url: "https://x/0.jpg", alt: "Sala", position: 0 },
  { url: "https://x/1.jpg", alt: "Cozinha", position: 1 },
];

describe("PhotoGallery", () => {
  it("com várias fotos, renderiza todas + setas de navegação", () => {
    render(<PhotoGallery images={IMAGES} />);
    expect(screen.getByAltText("Sala")).toBeInTheDocument();
    expect(screen.getByAltText("Cozinha")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /próxima foto/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /foto anterior/i }),
    ).toBeInTheDocument();
  });

  it("com uma foto, renderiza só o hero (sem setas)", () => {
    render(<PhotoGallery images={[IMAGES[0]]} />);
    expect(screen.getByAltText("Sala")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /próxima foto/i }),
    ).not.toBeInTheDocument();
  });
});
