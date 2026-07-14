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
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper shadow-2xl"
    >
      <Icon name="chat" size={18} />
      Falar com o assistente
    </button>
  );
}
