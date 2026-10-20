export default function ProjectDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Cargando proyecto">
      <div className="h-9 w-2/3 rounded-lg bg-white/10" />
      <div className="aspect-video w-full rounded-2xl bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-11/12 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
