import { describe, it, expect } from "vitest";
import type { UIMessage } from "ai";
import { messageText } from "@/src/ai/messageText";

describe("messageText", () => {
  it("extrai só o texto de uma mensagem com tool-part + text-part", () => {
    const msg = {
      id: "msg-1",
      role: "assistant",
      parts: [
        {
          type: "tool-getPropertyInfo",
          toolCallId: "call_1",
          state: "output-available",
          input: {},
          output: { wifiPassword: "floripa2024" },
        },
        { type: "text", text: "A senha é floripa2024." },
      ],
    };

    const result = messageText(msg as unknown as UIMessage);

    expect(result).toContain("floripa2024");
    expect(result).not.toContain("[object Object]");
  });

  it("retorna string vazia quando a mensagem não tem partes de texto", () => {
    const msg = {
      id: "msg-2",
      role: "assistant",
      parts: [
        {
          type: "dynamic-tool",
          toolName: "getNearbyPlaces",
          toolCallId: "call_2",
          state: "input-streaming",
        },
      ],
    };

    expect(messageText(msg as unknown as UIMessage)).toBe("");
  });

  it("junta múltiplas partes de texto em ordem", () => {
    const msg = {
      id: "msg-3",
      role: "assistant",
      parts: [
        { type: "text", text: "Olá! " },
        { type: "text", text: "Como posso ajudar?" },
      ],
    };

    expect(messageText(msg as unknown as UIMessage)).toBe(
      "Olá! Como posso ajudar?",
    );
  });
});
