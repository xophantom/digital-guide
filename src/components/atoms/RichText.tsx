import { Fragment } from "react";

// O assistente responde em markdown leve (só **negrito**, ex.: senha do WiFi).
// Convertemos inline em <strong> para não vazar os asteriscos na tela.
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        return bold ? (
          <strong key={i} className="font-semibold">
            {bold[1]}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
