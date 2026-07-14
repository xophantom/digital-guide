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
      aria-label={copied ? "Copiado" : label}
      title={copied ? "Copiado" : label}
      className="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-muted transition-colors hover:bg-(--accent-soft) hover:text-(--accent)"
    >
      <Icon name={copied ? "check" : "copy"} size={15} />
    </button>
  );
}
