"use client";

import { useState } from "react";
import { Icon } from "@/src/components/atoms/Icon";

export function CopyButton({
  value,
  label = "Copiar",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-2.5 py-1.5 text-[11px] font-semibold text-(--accent)"
    >
      <Icon name="copy" size={13} />
      {copied ? "Copiado" : label}
    </button>
  );
}
