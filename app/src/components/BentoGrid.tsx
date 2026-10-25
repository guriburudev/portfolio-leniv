import { useEffect, useState } from 'react'
import ProjectCard, { type Project } from './ProjectCard'
import { listProjects } from '../services/projectService'

// Alterna las previews técnicas existentes para mantener la composición Bento.
const previews: Project['preview'][] = ['analytics', 'tasks', 'api', 'system']

// Catálogo público de proyectos cargado directamente desde Supabase, sin datos de muestra.
export default function BentoGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Consume el catálogo público y adapta cada registro a la tarjeta visual existente.
  useEffect(() => {
    let active = true
    listProjects()
      .then((records) => {
        if (!active) return
        setProjects(records.map((record, index) => ({
          id: record.id,
          title: record.title,
          category: record.technologies[0] || 'Proyecto',
          description: record.description,
          technologies: record.technologies,
          preview: previews[index % previews.length],
          demoHref: record.demoUrl,
          featured: index === 0,
        })))
      })
      .catch(() => { if (active) setError('No se pudieron cargar los proyectos en este momento.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="scroll-mt-32 border-t border-subtle py-16">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-xs font-semibold text-accent">
            <span>02</span><span aria-hidden="true">·</span><span>Catálogo de proyectos</span>
          </div>
          <h2 id="projects-title" className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Arquitectura en producción</h2>
        </div>
        <p className="max-w-md text-sm font-normal leading-relaxed text-text-secondary">Diseño asimétrico Bento Grid. Cada tarjeta tiene una preview técnica estática y el botón de demo visible.</p>
      </div>

      {loading && <p className="text-sm text-text-secondary" role="status">Cargando proyectos…</p>}
      {error && <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-text-secondary" role="status">{error}</p>}
      {!loading && !error && projects.length === 0 && <p className="rounded-xl border border-default bg-surface p-5 text-sm text-text-secondary">Próximamente habrá nuevos proyectos.</p>}
      {!error && <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>}

      {/* Conserva el espacio de HU05 para el futuro módulo de detalle y demos privadas. */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed border-default bg-surface p-5 sm:flex-row">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-accent-surface font-mono text-xs font-bold text-accent">05</span>
          <div><span className="block font-mono text-xs text-text-tertiary">// HU05 — Módulo de detalle y demos privadas</span><p className="text-xs text-text-secondary">La vista de detalle y el acceso a repositorios se integrarán en su historia.</p></div>
        </div>
        <span className="rounded border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-[11px] text-accent">Sprint posterior</span>
      </div>
    </section>
  )
}
