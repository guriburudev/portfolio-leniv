import ProjectCard, { type Project } from './ProjectCard'

// Contenido de muestra para que el equipo pueda reemplazarlo por proyectos reales.
const projects: Project[] = [
  {
    title: 'Nexo Finance', category: 'Fintech · Dashboard',
    description: 'Una plataforma clara para visualizar movimientos, planificar presupuestos y tomar mejores decisiones financieras.',
    technologies: ['React', 'TypeScript', 'Charts'], imageAlt: 'Vista previa ilustrativa del dashboard financiero Nexo Finance',
    imageLabel: 'NEXO / FINANCE', featured: true,
  },
  {
    title: 'Atelier Objects', category: 'E-commerce · Diseño',
    description: 'Tienda digital minimalista para una marca independiente de objetos de diseño.',
    technologies: ['Next.js', 'Stripe'], imageAlt: 'Vista previa ilustrativa de la tienda Atelier Objects', imageLabel: 'ATELIER / OBJECTS',
  },
  {
    title: 'Taskflow', category: 'Productividad · SaaS',
    description: 'Herramienta colaborativa para organizar proyectos y dar seguimiento a cada entrega.',
    technologies: ['React', 'Node.js'], imageAlt: 'Vista previa ilustrativa de la aplicación de productividad Taskflow', imageLabel: 'TASKFLOW / BOARD',
  },
  {
    title: 'Verde Vivo', category: 'Web · Sustentabilidad',
    description: 'Experiencia web para descubrir productos locales y hábitos más sostenibles.',
    technologies: ['TypeScript', 'Tailwind'], imageAlt: 'Vista previa ilustrativa del sitio sustentable Verde Vivo', imageLabel: 'VERDE / VIVO',
  },
]

// La tarjeta principal ocupa más espacio; las demás conservan una lectura uniforme.
export default function BentoGrid() {
  return (
    <section id="proyectos" aria-labelledby="projects-title" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Una selección de mi trabajo</p>
          <h2 id="projects-title" className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Proyectos destacados</h2>
        </div>
        <span className="font-mono text-xs text-text-tertiary">01 — 04</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div className={index === 0 ? 'md:col-span-2 lg:row-span-2' : ''} key={project.title}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  )
}
