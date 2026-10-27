import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { btnPrimary } from '../lib/ui'
import { useProject } from '../hooks/useProject'
import ProjectDetailSkeleton from '../components/ProjectDetailSkeleton'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { signOut } = useAuth()
  const { project, loading, error } = useProject(id)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    supabase.auth.getUser().then(({ error: authError }) => {
      if (authError && (authError.status === 401 || authError.status === 403)) {
        void signOut()
      }
    })
  }, [signOut])

  const isVideoUrl = (url: string | null | undefined): boolean => {
    if (!url) return false
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.ogg') ||
      url.includes('blob:') ||
      url.includes('/video/')
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="Volver al inicio"
          className="text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          ← Volver a proyectos
        </Link>
      </div>

      {loading && <ProjectDetailSkeleton />}

      {error && !loading && (
        <div role="alert" className="rounded-2xl border border-warning/30 bg-warning/10 p-6">
          <p className="font-semibold text-warning">{error}</p>
          <Link to="/" className="mt-3 inline-block text-sm text-text-secondary underline hover:text-text-primary">
            Volver al inicio
          </Link>
        </div>
      )}

      {project && !loading && (
        <>
          <header>
            <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{project.description}</p>
          </header>

          <section aria-label="Demo del proyecto" className="overflow-hidden rounded-2xl border border-default bg-surface">
            {project.demoUrl ? (
              isVideoUrl(project.demoUrl) ? (
                <video
                  src={project.demoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="aspect-video h-full w-full object-cover"
                />
              ) : (
                <iframe
                  src={project.demoUrl}
                  title={`Demo de ${project.title}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  className="aspect-video h-full w-full border-0"
                />
              )
            ) : (
              <div className="grid aspect-video place-items-center text-sm text-text-tertiary">
                Este proyecto todavía no tiene una demo publicada.
              </div>
            )}
          </section>

          <section aria-labelledby="tech-title">
            <h2 id="tech-title" className="mb-3 font-display text-lg font-bold text-text-primary">Tecnologías</h2>
            <ul className="flex flex-wrap gap-1.5 font-mono text-xs text-text-secondary">
              {project.technologies.map((technology) => (
                <li key={technology} className="rounded border border-subtle bg-elevated px-2 py-1">{technology}</li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver el código de ${project.title} en GitHub`}
                className="inline-flex min-h-10 items-center rounded-md border border-default bg-surface-hover px-4 py-2 text-xs font-semibold text-text-primary hover:bg-elevated"
              >
                Ver en GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir la demo de ${project.title} en una pestaña nueva`}
                className={btnPrimary}
              >
                Abrir demo en pestaña nueva
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}