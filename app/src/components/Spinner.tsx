export default function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-default border-t-accent"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}