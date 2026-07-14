import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UIMessage } from "ai";
import { ChatPanel } from "@/src/components/organisms/ChatPanel";

// Mock de @ai-sdk/react inteiro (mesmo padrão de ExperienceGuideGenerator.test.tsx)
// para controlar messages/status/sendMessage sem disparar nenhuma request real.
const useChatMock = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useChat: (args: unknown) => useChatMock(args),
}));

// Mensagem com tool-part (formato real da v7: type "tool-<nome>") + text-part,
// prova que messageText/ChatBubble renderizam só o texto, nunca "[object Object]".
const MESSAGES_WITH_TOOL_PART = [
  {
    id: "user-1",
    role: "user",
    parts: [{ type: "text", text: "Posso trazer meu cachorro?" }],
  },
  {
    id: "assistant-1",
    role: "assistant",
    parts: [
      {
        type: "tool-getPropertyInfo",
        toolCallId: "call_1",
        state: "output-available",
        input: {},
        output: { allowPet: false },
      },
      {
        type: "text",
        text: "Infelizmente este imóvel não permite animais de estimação.",
      },
    ],
  },
] as unknown as UIMessage[];

beforeEach(() => {
  useChatMock.mockReset();
});

describe("ChatPanel", () => {
  it("mostra as 4 perguntas sugeridas com o texto exato", () => {
    useChatMock.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
    });

    render(<ChatPanel code="FLN001" onClose={vi.fn()} />);

    expect(screen.getByText("Qual a senha do WiFi?")).toBeInTheDocument();
    expect(
      screen.getByText("A que horas posso fazer check-in?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Posso trazer meu cachorro?")).toBeInTheDocument();
    expect(screen.getByText("Que restaurantes tem perto?")).toBeInTheDocument();
  });

  it("clicar numa pergunta sugerida chama sendMessage do hook com o texto", async () => {
    const sendMessage = vi.fn();
    useChatMock.mockReturnValue({ messages: [], sendMessage, status: "ready" });
    const user = userEvent.setup();

    render(<ChatPanel code="FLN001" onClose={vi.fn()} />);
    await user.click(screen.getByText("Qual a senha do WiFi?"));

    expect(sendMessage).toHaveBeenCalledWith({ text: "Qual a senha do WiFi?" });
  });

  it("renderiza o texto de uma mensagem com tool-part + text-part (não [object Object])", () => {
    useChatMock.mockReturnValue({
      messages: MESSAGES_WITH_TOOL_PART,
      sendMessage: vi.fn(),
      status: "ready",
    });

    render(<ChatPanel code="FLN001" onClose={vi.fn()} />);

    expect(
      screen.getByText(
        "Infelizmente este imóvel não permite animais de estimação.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\[object Object\]/)).not.toBeInTheDocument();
  });

  it("chama onClose ao clicar no botão de fechar", async () => {
    useChatMock.mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
    });
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ChatPanel code="FLN001" onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /fechar chat/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
