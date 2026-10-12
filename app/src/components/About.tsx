const experience = [
  {
    role: 'Fullstack Software Engineer',
    organization: 'Tech Lab Global',
    period: '2024 — Presente · Salta (Remoto)',
    description: 'Diseño e implementación de servicios en Node y TypeScript y frontends en React, con foco en rendimiento y experiencia de usuario.',
    state: 'current',
  },
  {
    role: 'Frontend Developer & UI System Architect',
    organization: 'Digital Cloud',
    period: '2022 — 2024 · Córdoba / Híbrido',
    description: 'Creación de bibliotecas de componentes accesibles, tokenización CSS y evolución de bases de código hacia TypeScript.',
    state: 'past',
  },
  {
    role: 'Ingeniería en Sistemas de Información',
    organization: 'Formación académica',
    period: '2019 — 2024',
    description: 'Formación en estructuras de datos, diseño relacional y patrones de arquitectura de software.',
    state: 'education',
  },
]

const skillGroups = [
  { title: 'Frontend & UX', level: 'Avanzado', skills: ['React 19', 'Next.js', 'Tailwind CSS', 'Storybook', 'Zustand'] },
  { title: 'Backend & APIs', level: 'Avanzado', skills: ['Node.js', 'Express', 'Fastify', 'REST / GraphQL', 'JWT Auth'] },
  { title: 'DevOps & Bases de Datos', level: 'Intermedio-alto', skills: ['PostgreSQL', 'Redis', 'Docker', 'Git / CI/CD', 'Linux CLI'] },
]

// Perfil de dos columnas con trayectoria estática y habilidades resumidas.
export default function About() {
  return (
    <section id="sobre-mi" aria-labelledby="about-title" className="scroll-mt-32 border-t border-subtle py-16">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-surface px-3 py-1 font-mono text-xs font-semibold text-accent">
            <span>03</span><span aria-hidden="true">·</span><span>Perfil & trayectoria</span>
          </div>
          <h2 id="about-title" className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Sobre mí</h2>
        </div>
        <p className="max-w-md text-sm font-normal leading-relaxed text-text-secondary">Ingeniero de software con visión integral de producto, rigor técnico y foco en soluciones escalables y mantenibles.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-3 border-b border-subtle pb-4 sm:flex-row sm:items-center">
              <h3 className="font-display text-lg font-bold text-text-primary">Trayectoria profesional & formación</h3>
              <span className="w-fit rounded border border-accent/20 bg-accent-surface px-2.5 py-1 font-mono text-xs text-accent">2021 — Actualidad</span>
            </div>
            <ol className="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-border">
              {experience.map((item) => (
                <li key={item.role} className="relative">
                  <span aria-hidden="true" className={`absolute -left-[27px] top-1 size-3.5 rounded-full border-2 border-surface ${item.state === 'current' ? 'bg-accent' : item.state === 'past' ? 'border-accent bg-surface-hover' : 'border-strong bg-surface-hover'}`} />
                  <div className="mb-1 flex flex-wrap items-baseline gap-2">
                    <h4 className="font-display text-sm font-bold text-text-primary">{item.role}</h4>
                    <span className="font-mono text-xs text-accent">· {item.organization}</span>
                  </div>
                  <span className="mb-2 block font-mono text-[11px] text-text-tertiary">{item.period}</span>
                  <p className="text-xs leading-relaxed text-text-secondary">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Marcador visual: las microinteracciones se dejan para la historia correspondiente. */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent-surface p-4 font-mono text-[11px] text-text-secondary">
            <span>// HU06: microinteracciones dinámicas del timeline</span>
            <span className="shrink-0 font-semibold text-accent">Sprint 3</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg">
            <h3 className="mb-4 border-b border-subtle pb-3 font-display text-base font-bold text-text-primary">Habilidades técnicas especializadas</h3>
            <div className="space-y-4">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 font-mono text-xs">
                    <span className="font-semibold text-text-primary">{group.title}</span>
                    <span className="text-accent">{group.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-text-secondary">
                    {group.skills.map((skill) => <span key={skill} className="rounded border border-subtle bg-elevated px-2 py-0.5">{skill}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-subtle pb-3">
              <div className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-success" /><span className="font-display text-sm font-bold text-text-primary">Disponibilidad laboral</span></div>
              <span className="rounded border border-success/20 bg-success/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-success">Open to work</span>
            </div>
            <dl className="space-y-3 font-mono text-xs">
              {[
                ['Modalidad', 'Remota / Híbrida'],
                ['Jornada', 'Full-time / Part-time'],
                ['Zona horaria', 'UTC-3'],
                ['Incorporación', 'Inmediata'],
              ].map(([label, value], index) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded border border-subtle bg-elevated p-2">
                  <dt className="text-text-tertiary">{label}:</dt><dd className={index === 3 ? 'font-semibold text-accent' : 'font-semibold text-text-primary'}>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t border-subtle pt-3">
              <a className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-accent px-4 py-2 text-xs font-semibold text-text-on-accent hover:bg-accent-hover" href="#contacto">Agendar conversación técnica →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
