export type Project = {
  title: string
  category: string
  description: string
  technologies: string[]
  imageAlt: string
  imageLabel: string
  featured?: boolean
}

type ProjectCardProps = { project: Project }

// Tarjeta reutilizable para proyectos destacados y secundarios.
export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={`flex min-h-[390px] flex-col overflow-hidden rounded-xl border border-default bg-surface ${project.featured ? 'h-full' : ''}`}>
      <div className={`relative flex min-h-[190px] flex-1 items-center justify-center overflow-hidden bg-elevated p-6 ${project.featured ? 'md:min-h-[320px]' : ''}`}>
        <div aria-hidden="true" className="absolute inset-0 bg-accent-surface" />
        <div role="img" aria-label={project.imageAlt} className="relative grid aspect-[16/9] w-full max-w-[420px] place-items-center rounded-lg border border-default bg-canvas shadow-lg">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">{project.imageLabel}</span>
        </div>
        {project.featured && <span className="absolute left-5 top-5 rounded-full border border-default bg-overlay px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary">Proyecto destacado</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{project.category}</div>
        <h3 className="font-display text-xl font-bold tracking-tight text-text-primary">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-text-secondary">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label={`Tecnologías de ${project.title}`}>
          {project.technologies.map((technology) => (
            <span key={technology} className="rounded-md bg-elevated px-2.5 py-1 font-mono text-[10px] text-text-secondary">{technology}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-default px-5 py-4 sm:px-6">
        <span className="font-mono text-xs text-text-tertiary">2026</span>
        {/* HU01 requiere que la demo sea visible; el acceso al repositorio corresponde a HU05. */}
        <a aria-label={`Ver demo en vivo de ${project.title}`} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-text-on-accent hover:bg-accent-hover" href="#proyectos">
          Demo en vivo <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}
