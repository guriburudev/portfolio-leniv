import ProjectCard, { type Project } from './ProjectCard'

// Proyectos de muestra y sus previews estáticos; no activan demos ni vistas privadas.
const projects: Project[] = [
  {
    title: 'Plataforma de Analítica en Tiempo Real',
    category: 'Fullstack Web App',
    description: 'Panel de analítica con métricas de tráfico, latencia y conexiones, presentado como una vista de producto de muestra.',
    technologies: ['React 19', 'Node.js', 'PostgreSQL', 'WebSockets'],
    preview: 'analytics',
    demoHref: '#demo-analytics',
    featured: true,
  },
  {
    title: 'Gestor de Tareas & Sprints',
    category: 'Productividad',
    description: 'Una vista de tablero para organizar tareas, prioridades y estados de un equipo de producto.',
    technologies: ['React', 'Express'],
    preview: 'tasks',
    demoHref: '#demo-tasks',
  },
  {
    title: 'API Engine & Middleware',
    category: 'Backend Core',
    description: 'Representación visual de una respuesta de API y su estado, como muestra de arquitectura backend.',
    technologies: ['Node.js', 'JWT'],
    preview: 'api',
    demoHref: '#demo-api',
  },
  {
    title: 'Sistema de Diseño Modular',
    category: 'Design System',
    description: 'Biblioteca visual basada en tokens semánticos, tipografía dual y criterios de accesibilidad.',
    technologies: ['Tailwind CSS', 'CSS tokens', 'HTML semántico'],
    preview: 'system',
    demoHref: '#demo-design-system',
    featured: true,
  },
]

// Grilla asimétrica: dos proyectos destacados se extienden a dos columnas en escritorio.
export default function BentoGrid() {
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {/* HU05 tiene su propio espacio de implementación en el sprint correspondiente. */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed border-default bg-surface p-5 sm:flex-row">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-accent-surface font-mono text-xs font-bold text-accent">05</span>
          <div>
            <span className="block font-mono text-xs text-text-tertiary">// HU05 — Módulo de detalle y demos privadas</span>
            <p className="text-xs text-text-secondary">La vista de detalle y el acceso a repositorios se integrarán en su historia.</p>
          </div>
        </div>
        <span className="rounded border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-[11px] text-accent">Sprint posterior</span>
      </div>
    </section>
  )
}
