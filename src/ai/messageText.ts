import { isTextUIPart, type UIMessage } from "ai";

/**
 * Extrai e junta o texto das partes de tipo "text" de uma UIMessage (v7).
 * Ignora partes de tool (`tool-<name>`, `dynamic-tool`) e demais tipos —
 * são renderizadas à parte (ou nem são renderizadas) pelo ChatPanel.
 */
export function messageText(message: UIMessage): string {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}
