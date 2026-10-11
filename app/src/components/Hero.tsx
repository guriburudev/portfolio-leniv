// Presentación principal: contenido y CTAs a la izquierda, ilustración de interfaz a la derecha.
export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div className="max-w-2xl">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-2 font-mono text-xs text-text-secondary">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" /> Portfolio · Desarrollo Fullstack
        </p>
        <h1 id="hero-title" className="font-display text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] text-text-primary sm:text-6xl lg:text-7xl">
          Ideas claras, experiencias <span className="text-accent">digitales.</span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
          Diseño y construyo productos web útiles, accesibles y preparados para crecer. Del primer boceto a una experiencia cuidada en cada pantalla.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a aria-label="Explorar proyectos destacados" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 font-semibold text-text-on-accent shadow-glow hover:bg-accent-hover" href="#proyectos">
            Ver proyectos <span aria-hidden="true">↘</span>
          </a>
          <a aria-label="Ir a la sección de contacto" className="inline-flex min-h-12 items-center justify-center rounded-md border border-default bg-surface px-5 font-semibold text-text-primary hover:border-strong" href="#contacto">
            Hablemos
          </a>
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">React · TypeScript · Node.js</p>
      </div>

      {/* Ilustración estática de una interfaz, reservada para contenido visual de la HU01. */}
      <div className="relative mx-auto w-full max-w-xl lg:mx-0">
        <div aria-hidden="true" className="absolute -inset-8 rounded-full bg-accent-surface blur-3xl" />
        <div role="img" aria-label="Ilustración de una interfaz digital con código y componentes de diseño" className="relative overflow-hidden rounded-2xl border border-default bg-surface p-4 shadow-xl sm:p-6">
          <div className="flex items-center justify-between border-b border-default pb-4">
            <div className="flex gap-2" aria-hidden="true"><span className="size-2.5 rounded-full bg-text-tertiary" /><span className="size-2.5 rounded-full bg-text-tertiary" /><span className="size-2.5 rounded-full bg-text-tertiary" /></div>
            <span className="font-mono text-[10px] text-text-tertiary">studio / preview</span>
          </div>
          <div className="grid gap-4 py-5 sm:grid-cols-[1fr_0.78fr]">
            <div className="flex min-h-56 flex-col justify-between rounded-xl border border-default bg-elevated p-5">
              <span className="font-mono text-xs text-accent">&lt;design_system /&gt;</span>
              <div>
                <div className="mb-3 h-2 w-3/4 rounded-full bg-text-tertiary" />
                <div className="mb-5 h-2 w-1/2 rounded-full bg-text-disabled" />
                <div className="h-9 w-28 rounded-md bg-accent" />
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-xl border border-default bg-accent-surface p-4"><span className="font-mono text-[10px] text-accent">01 / BUILD</span><div className="mt-7 h-7 w-7 rounded-lg border border-default bg-surface" /></div>
              <div className="rounded-xl border border-default bg-elevated p-4"><span className="font-mono text-[10px] text-text-secondary">02 / SHIP</span><div className="mt-7 h-1.5 w-full rounded-full bg-text-disabled"><div className="h-full w-2/3 rounded-full bg-accent" /></div></div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-default bg-canvas px-4 py-3">
            <span className="font-mono text-xs text-text-secondary">Experiencia en construcción</span>
            <span className="font-mono text-xs text-accent">100%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
