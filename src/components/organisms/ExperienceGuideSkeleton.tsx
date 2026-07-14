export function ExperienceGuideSkeleton() {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-label="Gerando guia de experiências"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-line" />
        <div className="h-5 w-40 rounded bg-line" />
      </div>
      <div className="h-4 w-full rounded bg-line" />
      <div className="mt-2 h-4 w-2/3 rounded bg-line" />
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-14 rounded-2xl bg-line" />
        <div className="h-14 rounded-2xl bg-line" />
        <div className="h-14 rounded-2xl bg-line" />
      </div>
    </div>
  );
}
