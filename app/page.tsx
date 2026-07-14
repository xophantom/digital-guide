import Link from "next/link";
import { SEED_PROPERTIES } from "@/src/db/seed-data";

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
          Imóveis
        </p>
        {SEED_PROPERTIES.map((p) => (
          <Link
            key={p.code}
            href={`/${p.code}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 transition hover:-translate-y-0.5"
          >
            <span className="text-sm">{p.name}</span>
            <span className="font-mono text-xs text-(--accent)">/{p.code}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
