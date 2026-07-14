"use client";

import { useState } from "react";
import { Icon } from "@/src/components/atoms/Icon";
import { ChatPanel } from "@/src/components/organisms/ChatPanel";

export function ChatFab({ code }: { code: string }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return <ChatPanel code={code} onClose={() => setOpen(false)} />;
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Falar com o assistente"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-2xl transition-transform hover:scale-105"
    >
      <Icon name="chat" size={24} />
    </button>
  );
}
