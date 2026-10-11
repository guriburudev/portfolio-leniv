const skills = [
  { name: 'Frontend', tools: 'React · TypeScript · Tailwind CSS', number: '01' },
  { name: 'Backend', tools: 'Node.js · APIs · PostgreSQL', number: '02' },
  { name: 'Diseño de producto', tools: 'Sistemas visuales · Accesibilidad', number: '03' },
]

// Perfil y capacidades en dos columnas para diferenciar esta sección del Hero.
export default function About() {
  return (
    <section id="sobre-mi" aria-labelledby="about-title" className="border-y border-default bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">Un poco sobre mí</p>
          <h2 id="about-title" className="max-w-lg font-display text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
            Tecnología con intención y atención al detalle.
          </h2>
          <div className="mt-7 max-w-xl space-y-4 text-sm leading-7 text-text-secondary sm:text-base">
            <p>Me interesa crear productos digitales que resuelvan problemas reales y sean agradables de usar. Trabajo con una mirada integral: desde la estructura y el rendimiento hasta los pequeños detalles visuales.</p>
            <p>Disfruto colaborar, aprender nuevas herramientas y convertir ideas en experiencias accesibles que funcionen bien en cualquier pantalla.</p>
          </div>
          <a className="mt-8 inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-hover" href="#contacto">
            Conversemos <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="space-y-3" aria-label="Áreas de experiencia">
          {skills.map((skill) => (
            <article key={skill.number} className="grid gap-4 rounded-xl border border-default bg-surface p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
              <span aria-hidden="true" className="font-mono text-xs text-accent">/{skill.number}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary">{skill.name}</h3>
                <p className="mt-1 font-mono text-xs leading-6 text-text-secondary">{skill.tools}</p>
              </div>
            </article>
          ))}
          <div className="flex flex-wrap gap-2 pt-2" aria-label="Tecnologías">
            {['JavaScript', 'Git', 'Figma', 'Responsive UI'].map((technology) => (
              <span key={technology} className="rounded-full border border-default bg-accent-surface px-3 py-1.5 font-mono text-[10px] text-accent">{technology}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
