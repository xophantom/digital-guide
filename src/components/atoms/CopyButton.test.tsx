import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyButton } from "@/src/components/atoms/CopyButton";

describe("CopyButton", () => {
  it("copia o valor e mostra estado copiado", async () => {
    const user = userEvent.setup();
    render(<CopyButton value="floripa2024" label="Copiar senha" />);
    // userEvent.setup() substitui navigator.clipboard por seu próprio stub;
    // por isso o spy é criado depois do setup, não num beforeEach.
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole("button", { name: /copiar senha/i }));
    expect(writeText).toHaveBeenCalledWith("floripa2024");
    expect(await screen.findByText(/copiado/i)).toBeInTheDocument();
  });
});
