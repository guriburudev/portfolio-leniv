const stack = [
  { mark: '⚛', name: 'React 19', detail: 'Frontend UI' },
  { mark: 'TS', name: 'TypeScript', detail: 'Tipado estricto' },
  { mark: '≈', name: 'Tailwind CSS', detail: 'Tokens y diseño' },
  { mark: '⬢', name: 'Node.js', detail: 'Runtime server' },
  { mark: 'DB', name: 'PostgreSQL', detail: 'Base de datos' },
  { mark: '⚡', name: 'Vite 6', detail: 'Bundler rápido' },
]

// Hero basado en la referencia: presentación, panel estático de código y stack tecnológico.
export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative scroll-mt-32 pb-16 pt-6 lg:pb-24">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-surface px-3 py-1 font-mono text-xs font-medium tracking-wide text-accent">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" /> Portfolio · Arquitectura Sprint 1 (HU01)
        </span>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <h1 id="hero-title" className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Construyendo soluciones <span className="text-accent">fullstack robustas</span> de punta a punta.
          </h1>
          <p className="max-w-2xl text-base font-normal leading-relaxed text-text-secondary sm:text-lg">
            Ingeniero de software enfocado en arquitecturas escalables, interfaces dinámicas de alto impacto y APIs de alto rendimiento. Conecto una experiencia de usuario cuidada con ingeniería sólida.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a aria-label="Explorar proyectos Bento" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-text-on-accent hover:bg-accent-hover" href="#proyectos">
              Explorar proyectos Bento <span aria-hidden="true">⌄</span>
            </a>
            <a aria-label="Abrir GitHub" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-default bg-surface px-5 py-3.5 text-sm font-medium text-text-secondary hover:border-strong hover:bg-surface-hover hover:text-text-primary" href="https://github.com/" rel="noreferrer" target="_blank">
              <span aria-hidden="true" className="font-mono font-bold">GH</span> Repositorio GitHub
            </a>
          </div>
        </div>

        {/* Vista ilustrativa sin ejecución de código ni animaciones. */}
        <div className="lg:col-span-5">
          <div role="img" aria-label="Panel ilustrativo con un perfil de ingeniería escrito en TypeScript" className="relative overflow-hidden rounded-2xl border border-default bg-surface p-5 shadow-xl backdrop-blur-md sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-subtle pb-4">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-error" />
                <span aria-hidden="true" className="size-3 rounded-full bg-warning" />
                <span aria-hidden="true" className="size-3 rounded-full bg-success" />
                <span className="ml-2 font-mono text-[11px] text-text-tertiary">engineer_profile.ts</span>
              </div>
              <span className="rounded border border-accent/20 bg-accent-surface px-2 py-0.5 font-mono text-[10px] text-accent">TypeScript 5.7</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs leading-relaxed text-text-secondary">
              <p><span className="font-semibold text-accent">interface</span> <span className="font-semibold text-text-primary">Engineer</span> {'{'}</p>
              <p className="pl-4">name: <span className="text-accent">'Alex Dev'</span>;</p>
              <p className="pl-4">role: <span className="text-accent">'Fullstack Developer'</span>;</p>
              <p className="pl-4">sprint: <span className="text-accent">1</span> <span className="text-text-tertiary">// HU01 Portfolio</span>;</p>
              <p className="pl-4">focus: [<span className="text-accent">'React'</span>, <span className="text-accent">'Node'</span>, <span className="text-accent">'Tailwind'</span>, <span className="text-accent">'Postgres'</span>];</p>
              <p className="pl-4">status: <span className="font-semibold text-success">'Ready to build'</span>;</p>
              <p>{'}'}</p>
              <div className="flex items-center justify-between border-t border-subtle pt-3 text-[11px]">
                <span className="text-text-tertiary">// Interfaz estática · sin animaciones</span>
                <span aria-hidden="true" className="inline-block h-4 w-2 bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="stack-ribbon" className="mt-16 border-t border-subtle pt-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
          <div>
            <span className="mb-1 block font-mono text-xs font-semibold uppercase tracking-widest text-accent">Capacidades principales</span>
            <h2 className="font-display text-xl font-bold text-text-primary">Stack tecnológico central</h2>
          </div>
          <p className="font-mono text-xs text-text-tertiary">Arquitectura moderna · TypeScript estricto · Performance</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {stack.map((technology) => (
            <div key={technology.name} className="flex flex-col items-center justify-center gap-2 rounded-xl border border-default bg-surface p-3.5 text-center">
              <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-accent-surface font-mono text-sm font-bold text-accent">{technology.mark}</span>
              <span className="text-xs font-semibold text-text-primary">{technology.name}</span>
              <span className="font-mono text-[10px] text-text-tertiary">{technology.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
