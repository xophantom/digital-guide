import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatFab } from "@/src/components/organisms/ChatFab";

// Mock de @ai-sdk/react (mesmo padrão de ChatPanel.test.tsx): abrir o painel
// monta o ChatPanel, que chama useChat — sem isso dispararia uma request real.
const useChatMock = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: (args: unknown) => useChatMock(args),
}));

beforeEach(() => {
  useChatMock.mockReset();
  useChatMock.mockReturnValue({ messages: [], sendMessage: vi.fn(), status: "ready" });
});

describe("ChatFab", () => {
  it("inicia fechado: só o botão do FAB aparece, painel não é exibido", () => {
    render(<ChatFab code="FLN001" />);

    expect(
      screen.getByRole("button", { name: /falar com o assistente/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Assistente do imóvel")).not.toBeInTheDocument();
  });

  it("clicar no FAB abre o painel (header do chat aparece)", async () => {
    const user = userEvent.setup();
    render(<ChatFab code="FLN001" />);

    await user.click(screen.getByRole("button", { name: /falar com o assistente/i }));

    expect(screen.getByText("Assistente do imóvel")).toBeInTheDocument();
  });

  it("fechar o painel (botão de fechar → onClose) esconde o chat e volta a mostrar o FAB", async () => {
    const user = userEvent.setup();
    render(<ChatFab code="FLN001" />);

    await user.click(screen.getByRole("button", { name: /falar com o assistente/i }));
    expect(screen.getByText("Assistente do imóvel")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /fechar chat/i }));

    expect(screen.queryByText("Assistente do imóvel")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /falar com o assistente/i }),
    ).toBeInTheDocument();
  });
});
