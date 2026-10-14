import DemoButton from './DemoButton'
import { useRef, type MouseEvent } from 'react'

export type PreviewKind = 'analytics' | 'tasks' | 'api' | 'system'

export type Project = {
  id?: string
  title: string
  category: string
  description: string
  technologies: string[]
  preview: PreviewKind
  demoHref: string
  featured?: boolean
}

type ProjectCardProps = { project: Project }

// ID estable del proyecto para el deep link (/login?project=<id> → /work/<id>).
function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
  return slug || 'proyecto'
}

// Vista ilustrativa correspondiente a cada proyecto; todos sus elementos son estáticos.
function ProjectPreview({ kind }: { kind: PreviewKind }) {
  if (kind === 'analytics') {
    return (
      <div className="w-full max-w-lg rounded-xl border border-default bg-surface p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between border-b border-subtle pb-3">
          <span className="font-mono text-xs font-semibold text-text-primary">Live Traffic Analytics</span>
          <span className="rounded border border-success/20 bg-success/10 px-2 py-0.5 font-mono text-[10px] text-success">● 99.98% Uptime</span>
        </div>
        <div className="mb-3 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            ['Requests / sec', '14.8k'],
            ['P99 Latency', '18ms'],
            ['DB Connections', '42 / 50'],
          ].map(([label, value], index) => (
            <div key={label} className="rounded-lg border border-subtle bg-elevated p-2 sm:p-2.5">
              <span className="block font-mono text-[9px] text-text-tertiary sm:text-[10px]">{label}</span>
              <span className={`font-mono text-xs font-bold sm:text-sm ${index === 1 ? 'text-accent' : 'text-text-primary'}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex h-10 items-end gap-1 rounded border border-accent/10 bg-accent-surface px-2 pb-1">
          {[3, 5, 4, 7, 8, 10, 7, 6, 8, 9, 7, 10].map((height, index) => (
            <span key={`${height}-${index}`} className="flex-1 rounded-t-sm bg-accent" style={{ height: `${height * 10}%`, opacity: 0.45 + (index % 4) * 0.15 }} />
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'tasks') {
    return (
      <div className="w-full max-w-xs rounded-xl border border-default bg-surface p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-text-tertiary"><span>// Task Kanban</span><span className="font-bold text-accent">In Progress</span></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded border border-subtle bg-elevated p-2.5 text-xs"><span className="font-medium text-text-primary">HU01 - Maquetado UI</span><span aria-hidden="true" className="size-2 rounded-full bg-success" /></div>
          <div className="flex items-center justify-between rounded border border-subtle bg-elevated p-2.5 text-xs"><span className="text-text-secondary">HU02 - Auth JWT</span><span aria-hidden="true" className="size-2 rounded-full bg-warning" /></div>
        </div>
      </div>
    )
  }

  if (kind === 'api') {
    return (
      <div className="w-full max-w-xs rounded-xl border border-strong bg-canvas p-4 font-mono text-[11px] shadow-xl">
        <p className="mb-2 text-text-tertiary">// REST Endpoint Proxy</p>
        <p className="text-success">POST /api/v1/auth/login</p>
        <p className="mt-1 text-text-tertiary">Status: <span className="text-success">200 OK</span> (24ms)</p>
        <p className="mt-3 rounded border border-subtle bg-surface p-2 text-[10px] text-accent">{'{ "token": "eyJh...9xZ" }'}</p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-lg flex-wrap items-center justify-center gap-3 rounded-xl border border-default bg-surface p-5 shadow-xl">
      <span aria-hidden="true" className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-text-on-accent">Primary CTA</span>
      <span className="rounded-md border border-default bg-surface-hover px-4 py-2 text-xs font-medium text-text-primary">Secondary</span>
      <span className="rounded-full border border-accent/25 bg-accent-surface px-3 py-1 font-mono text-xs text-accent">WCAG AA</span>
      <span className="flex items-center gap-2 rounded border border-subtle bg-elevated px-3 py-1 font-mono text-xs text-text-secondary"><span aria-hidden="true" className="size-2 rounded-full bg-success" /> Active State</span>
    </div>
  )
}

// Tarjeta reutilizable con preview, contenido y enlace de demostración siempre visible.
export default function ProjectCard({ project }: ProjectCardProps) {
  const projectId = project.id ?? slugify(project.title)
  const cardRef = useRef<HTMLElement>(null)

const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
  const el = cardRef.current
  if (!el) return
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
  el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
}

  return (
    <article 
      ref ={cardRef}
      onMouseMove={handleMouseMove}
      className={`flex flex-col justify-between overflow-hidden rounded-2xl border border-default bg-surface ${project.featured ? 'lg:col-span-2' : ''}`}>
        <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          'radial-gradient(260px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(52,211,153,0.18), transparent 70%)',
      }}
    />
      <div role="img" aria-label={`Vista previa estática del proyecto ${project.title}`} className="relative flex h-64 items-center justify-center overflow-hidden border-b border-subtle bg-elevated p-5 sm:h-72 sm:p-6">
        <ProjectPreview kind={project.preview} />
        <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur ${project.featured ? 'border-accent/30 bg-overlay text-accent' : 'border-subtle bg-overlay text-text-tertiary'}`}>
          {project.featured ? '★ Proyecto principal · 2 col' : 'Preview de proyecto'}
        </span>
      </div>
      <div className="flex flex-grow flex-col justify-between gap-6 p-6 sm:p-7 relative">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded border border-accent/20 bg-accent-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">{project.category}</span>
            {project.featured && <span className="rounded border border-subtle bg-surface-hover px-2.5 py-0.5 font-mono text-[11px] font-semibold text-text-secondary">Sprint 1 compatible</span>}
          </div>
          <h3 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">{project.title}</h3>
          <p className="text-sm leading-relaxed text-text-secondary">{project.description}</p>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-subtle pt-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-secondary" aria-label={`Tecnologías de ${project.title}`}>
            {project.technologies.map((technology) => <span key={technology} className="rounded border border-subtle bg-elevated px-2 py-1">{technology}</span>)}
          </div>
          {/* Sin sesión lleva al login guardando el proyecto; con sesión, al detalle del proyecto. */}
          <DemoButton
            projectId={projectId}
            ariaLabel={`Demo en vivo de ${project.title}`}
            className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-text-on-accent hover:bg-accent-hover"
          >
            Demo en vivo <span aria-hidden="true" className="ml-1">→</span>
          </DemoButton>
        </div>
      </div>
    </article>
  )
}