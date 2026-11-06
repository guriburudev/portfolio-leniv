import { useEffect, useState } from 'react'
import ProjectCard, { type Project } from './ProjectCard'
import { listProjects } from '../services/projectService'

export default function BentoGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    listProjects()
      .then((records) => {
        if (!active) return
        setProjects(
          records.map((record, index) => {
            const techs = Array.isArray(record.technologies)
              ? record.technologies
              : typeof record.technologies === 'string'
              ? (record.technologies as string).split(',').map((t) => t.trim())
              : []
            const firstCategory = techs.length > 0 ? techs[0] : 'Proyecto'

            return {
              id: record.id,
              title: record.title,
              category: firstCategory,
              description: record.description,
              technologies: techs,
              imageUrl: record.imageUrl  || null,
              demoUrl: record.demoUrl || null,
              featured: index === 0,
            }
          })
        )
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar los proyectos en este momento.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="scroll-mt-32 border-t border-subtle py-16" data-reveal="">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end" data-reveal="">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-xs font-semibold text-accent">
            <span>Catálogo de proyectos</span>
          </div>
          <h2 id="projects-title" className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Arquitectura en producción
          </h2>
        </div>
      </div>

      {loading && <p className="text-sm text-text-secondary" data-reveal="" role="status">Cargando proyectos…</p>}
      
      {error && (
        <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-text-secondary" data-reveal="" role="status">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="rounded-xl border border-default bg-surface p-5 text-sm text-text-secondary" data-reveal="">
          Próximamente habrá nuevos proyectos.
        </p>
      )}

      {!error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal="">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </section>
  )
}
