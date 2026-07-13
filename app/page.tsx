import Link from "next/link";

const SAMPLES = [
  { code: "FLN001", label: "Apartamento Beira-Mar · Florianópolis" },
  { code: "GRM001", label: "Chalé Serra · Gramado" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-(--accent)">
          Seazone
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight">
          Guia Digital do Hóspede
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Cada imóvel tem um guia único com tudo da estadia: acesso, WiFi,
          regras e dicas da região. Acesse pelo código do seu imóvel.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-[0.13em] text-muted">
          Exemplos
        </p>
        {SAMPLES.map((s) => (
          <Link
            key={s.code}
            href={`/${s.code}`}
            className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3 transition hover:-translate-y-0.5"
          >
            <span className="text-sm">{s.label}</span>
            <span className="font-(family-name:--font-inter) text-xs text-(--accent)">
              /{s.code}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
