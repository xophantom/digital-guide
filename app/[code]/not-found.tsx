import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
        Imóvel não encontrado
      </p>
      <h1 className="font-display text-3xl tracking-tight">
        Esse código não existe
      </h1>
      <p className="text-muted">
        Confira o código do seu imóvel no e-mail da reserva. Se o problema
        continuar, fale com a Seazone.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl border border-line bg-card px-4 py-2 text-sm"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
