export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
      {children}
    </span>
  );
}
