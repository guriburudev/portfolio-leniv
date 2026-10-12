const channels = [
  { label: 'GitHub', value: 'github.com/alexdev', href: 'https://github.com/alexdev', mark: 'GH' },
  { label: 'LinkedIn', value: 'linkedin.com/in/alexdev', href: 'https://linkedin.com/in/alexdev', mark: 'in' },
  { label: 'Email directo', value: 'alex.dev@portfolio.example.com', href: 'mailto:alex.dev@portfolio.example.com', mark: '@' },
]

// Contacto conserva sus canales y ubicación; el formulario queda reservado para HU03.
export default function ContactSection() {
  return (
    <section id="contacto" aria-labelledby="contact-title" className="scroll-mt-32 border-t border-subtle py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-xs font-semibold text-accent">
            <span>04</span><span aria-hidden="true">·</span><span>Canal directo</span>
          </div>
          <h2 id="contact-title" className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Contacto</h2>
        </div>
        <p className="max-w-md text-sm font-normal leading-relaxed text-text-secondary">Canales de presentación y coordinación técnica. El formulario será incorporado por la persona responsable de HU03.</p>
      </div>

      <div role="note" className="mb-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-accent/25 bg-accent-surface p-4 text-xs sm:flex-row sm:items-center">
        <span className="flex items-center gap-3 font-mono text-[11px] text-text-secondary"><span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-accent" />-- Aquí va la HU03: Formulario de Contacto --</span>
        <span className="text-text-tertiary">El envío y la persistencia se completarán en otra historia.</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Hueco del formulario omitido, tal como se solicita para respetar el reparto de historias. */}
        <div role="group" aria-label="Espacio reservado para el formulario de contacto HU03" className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-default bg-surface p-8 lg:col-span-7">
          <span aria-hidden="true" className="font-mono text-xs text-text-tertiary">&lt; HU03 / ContactForm /&gt;</span>
        </div>

        <aside aria-label="Canales de contacto y ubicación" className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
            <h3 className="mb-4 border-b border-subtle pb-3 font-display text-sm font-bold text-text-primary">Canales directos & redes</h3>
            <div className="space-y-3 font-mono text-xs">
              {channels.map((channel) => (
                <a key={channel.label} aria-label={`${channel.label}: ${channel.value}`} className="flex items-center justify-between gap-3 rounded-lg border border-default bg-elevated p-3 text-text-secondary hover:border-accent hover:text-text-primary" href={channel.href} rel={channel.href.startsWith('http') ? 'noreferrer' : undefined} target={channel.href.startsWith('http') ? '_blank' : undefined}>
                  <span className="flex items-center gap-2.5"><span aria-hidden="true" className="grid size-5 place-items-center font-mono text-xs font-bold text-accent">{channel.mark}</span><span className="font-medium">{channel.label}</span></span>
                  <span className="truncate text-[10px] text-accent">{channel.value} →</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b border-subtle pb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-tertiary">Ubicación & zona horaria</span>
              <span className="font-mono text-xs text-accent">UTC-3</span>
            </div>
            <div className="bg-grid-pattern relative flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-subtle bg-elevated p-4 text-center">
              <span aria-hidden="true" className="mb-2 grid size-7 place-items-center rounded-full border border-accent bg-accent-surface text-accent">⌖</span>
              <span className="font-display text-sm font-bold text-text-primary">Salta, Argentina</span>
              <span className="font-mono text-[11px] text-text-tertiary">Horario Argentina (ART) · Cobertura global</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
