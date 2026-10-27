import DemoButton from './DemoButton'
import { useRef, type MouseEvent } from 'react'

export type Project = {
  id?: string
  title?: string
  titulo?: string
  category?: string
  description?: string
  descripcion?: string
  technologies?: string[]
  tags_tecnologias?: string[]
  imageUrl?: string | null
  image_url?: string | null
  demoUrl?: string | null
  demo_url?: string | null
  featured?: boolean
  isPrivate?: boolean
  is_private?: boolean
}

type ProjectCardProps = { project: Project }

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'proyecto'
}

function isVideoUrl(url?: string | null): boolean {
  if (!url) return false
  return (
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg') ||
    url.includes('/video/') ||
    url.includes('blob:')
  )
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Normalización de propiedades
  const projectTitle = project.titulo || project.title || 'Proyecto sin título'
  const projectDescription = project.descripcion || project.description || ''
  const projectTechnologies = project.tags_tecnologias || project.technologies || []
  const imageUrl = project.image_url || project.imageUrl
  const demoUrl = project.demo_url || project.demoUrl

  const projectId = project.id ?? slugify(projectTitle)
  const cardRef = useRef<HTMLElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }

  const hasVideo = isVideoUrl(demoUrl)

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-default bg-surface ${
        project.featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(260px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(52,211,153,0.18), transparent 70%)',
        }}
      />

      {/* RENDERIZADO MULTIMEDIA DESDE LA BASE DE DATOS */}
      <div
        role="img"
        aria-label={`Vista previa del proyecto ${projectTitle}`}
        className="relative flex h-64 w-full items-center justify-center overflow-hidden border-b border-subtle bg-elevated sm:h-72"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Previsualización de ${projectTitle}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : hasVideo ? (
          <video
            src={demoUrl!}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-text-tertiary">
            // SIN PREVISUALIZACIÓN DISPONIBLE
          </div>
        )}

        <span
          className={`absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur ${
            project.featured
              ? 'border-accent/30 bg-overlay text-accent'
              : 'border-subtle bg-overlay text-text-tertiary'
          }`}
        >
          {project.featured ? '★ Proyecto principal · 2 col' : 'Preview de proyecto'}
        </span>
      </div>

      <div className="relative flex flex-grow flex-col justify-between gap-6 p-6 sm:p-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded border border-accent/20 bg-accent-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
              {project.category || 'Fullstack'}
            </span>
            {project.featured && (
              <span className="rounded border border-subtle bg-surface-hover px-2.5 py-0.5 font-mono text-[11px] font-semibold text-text-secondary">
                Sprint 1 compatible
              </span>
            )}
          </div>

          <h3 className="mb-2 font-display text-xl font-bold text-text-primary sm:text-2xl">
            {projectTitle}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            {projectDescription}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-subtle pt-4 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-secondary"
            aria-label={`Tecnologías de ${projectTitle}`}
          >
            {projectTechnologies.map((technology) => (
              <span key={technology} className="rounded border border-subtle bg-elevated px-2 py-1">
                {technology}
              </span>
            ))}
          </div>

          <DemoButton
            projectId={projectId}
            ariaLabel={`Demo en vivo de ${projectTitle}`}
            className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-text-on-accent hover:bg-accent-hover"
          >
            Demo en vivo <span aria-hidden="true" className="ml-1">→</span>
          </DemoButton>
        </div>
      </div>
    </article>
  )
}