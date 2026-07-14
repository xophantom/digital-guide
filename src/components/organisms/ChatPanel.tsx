"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Icon } from "@/src/components/atoms/Icon";
import { ChatBubble } from "@/src/components/molecules/ChatBubble";
import { messageText } from "@/src/ai/messageText";

const SUGGESTED_QUESTIONS = [
  "Qual a senha do WiFi?",
  "A que horas posso fazer check-in?",
  "Posso trazer meu cachorro?",
  "Que restaurantes tem perto?",
] as const;

function StreamingCursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-[1px] bg-(--accent) align-middle"
    />
  );
}

export function ChatPanel({
  code,
  onClose,
}: {
  code: string;
  onClose: () => void;
}) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/properties/${code}/chat`,
    }),
  });
  const [input, setInput] = useState("");

  const canSend = status === "ready";
  const lastMessage = messages[messages.length - 1];
  // O cursor só faz sentido colado na última mensagem quando ela é do
  // assistente; um novo turno do usuário não deve herdar o cursor anterior.
  const isStreamingReply = status === "streaming" && lastMessage?.role === "assistant";
  const isWaitingForReply = status === "submitted";

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !canSend) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-30 flex max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96">
      <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-(--accent)" aria-hidden />
          <span className="font-display text-sm font-semibold">
            Assistente do imóvel
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar chat"
          className="rounded-full p-1 text-muted hover:text-ink"
        >
          <Icon name="close" size={18} />
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto bg-paper px-4 py-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">
            Pergunte sobre o WiFi, check-in, regras ou lugares perto do imóvel.
          </p>
        ) : null}
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1;
          return (
            <ChatBubble
              key={message.id}
              role={message.role === "user" ? "user" : "assistant"}
            >
              {messageText(message)}
              {isLast && isStreamingReply ? <StreamingCursor /> : null}
            </ChatBubble>
          );
        })}
        {isWaitingForReply ? (
          <ChatBubble role="assistant">
            <StreamingCursor />
          </ChatBubble>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            disabled={!canSend}
            onClick={() => send(question)}
            className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink/80 disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line px-4 py-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escreva sua pergunta..."
          disabled={!canSend}
          aria-label="Sua pergunta"
          className="flex-1 rounded-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSend || !input.trim()}
          aria-label="Enviar pergunta"
          className="rounded-full bg-(--accent) p-2 text-white disabled:opacity-50"
        >
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
}
