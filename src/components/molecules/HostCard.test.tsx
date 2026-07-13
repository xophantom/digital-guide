import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostCard } from "@/src/components/molecules/HostCard";

describe("HostCard", () => {
  it("mostra nome, iniciais e telefone", () => {
    render(<HostCard name="Ana Paula" phone="+5548991234567" />);
    expect(screen.getByText("Ana Paula")).toBeInTheDocument();
    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.getByText(/48/)).toBeInTheDocument();
  });
});
