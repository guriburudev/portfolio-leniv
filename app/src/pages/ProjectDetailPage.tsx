import { Link, useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import ProjectDetailSkeleton from '../components/ProjectDetailSkeleton';
import ExternalApiDemo from '../components/ExternalApiDemo';
import LogoutButton from '../components/LogoutButton';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link to="/work" className="text-sm text-zinc-400 hover:text-white" aria-label="Volver a la lista de proyectos">
          ← Volver a proyectos
        </Link>
        <LogoutButton />
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 pb-16">
        {loading && <ProjectDetailSkeleton />}

        {error && !loading && (
          <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
            <p className="font-medium text-red-100">{error}</p>
            <Link to="/work" className="mt-3 inline-block text-sm text-red-200 underline">
              Ver todos los proyectos
            </Link>
          </div>
        )}

        {project && !loading && (
          <>
            <div>
              <h1 className="text-3xl font-semibold md:text-4xl">{project.titulo}</h1>
              <p className="mt-3 max-w-2xl text-zinc-400">{project.descripcion}</p>
            </div>

            {/* Contenedor principal de la demo (iframe/video) */}
            <section aria-label="Demo del proyecto" className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              {project.demo_url ? (
                <iframe
                  src={project.demo_url}
                  title={`Demo de ${project.titulo}`}
                  loading="lazy"
                  className="aspect-video w-full"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <div className="grid aspect-video place-items-center text-zinc-500">
                  Este proyecto todavía no tiene demo.
                </div>
              )}
            </section>

            <section aria-labelledby="tech-title">
              <h2 id="tech-title" className="mb-3 text-lg font-semibold">Tecnologías</h2>
              <ul className="flex flex-wrap gap-2">
                {project.tags_tecnologias.map((t) => (
                  <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-sm">{t}</li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver el código de ${project.titulo} en GitHub`}
                  className="rounded-lg border border-white/10 px-4 py-2 hover:bg-white/10"
                >
                  Ver en GitHub
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir la demo de ${project.titulo} en una pestaña nueva`}
                  className="rounded-lg bg-emerald-400 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-300"
                >
                  Abrir demo en pestaña nueva
                </a>
              )}
            </div>

            <ExternalApiDemo />
          </>
        )}
      </main>
    </div>
  );
}
