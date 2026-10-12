const footerLinks = [
  { label: '1. Inicio (Hero & Stack)', href: '#inicio' },
  { label: '2. Proyectos (Bento HU01)', href: '#proyectos' },
  { label: '3. Sobre mí (Trayectoria)', href: '#sobre-mi' },
  { label: '4. Contacto (HU03)', href: '#contacto' },
]

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
]

// Pie de página de tres columnas según la referencia, sin añadir lógica de otras historias.
export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-default bg-overlay px-4 pb-10 pt-14 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-8 place-items-center rounded bg-accent font-mono text-xs font-bold text-text-on-accent">&lt;A/&gt;</span>
              <span className="font-display text-base font-bold text-text-primary">Portfolio Fullstack</span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-text-secondary sm:text-sm">Proyecto desarrollado con arquitectura modular. Enfoque integral en experiencia de usuario, diseño de sistemas y software escalable.</p>
            <div className="flex gap-4 font-mono text-xs text-text-secondary">
              {socialLinks.map((social) => <a key={social.label} aria-label={`Visitar ${social.label}`} className="hover:text-text-primary" href={social.href} rel="noreferrer" target="_blank">{social.label} ↗</a>)}
            </div>
            <p className="font-mono text-[11px] text-text-tertiary">Equipo de 5 integrantes · Octubre 2026</p>
          </div>

          <div className="flex flex-col gap-3 md:col-span-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Navegación</span>
            <ul className="space-y-2 text-xs text-text-secondary">
              {footerLinks.map((link) => <li key={link.href}><a className="hover:text-text-primary" href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>

          <div className="flex flex-col gap-3 md:col-span-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Sprint status</span>
            <div className="flex flex-col gap-2 rounded-lg border border-subtle bg-elevated p-3.5 font-mono text-xs">
              <div className="flex items-center justify-between gap-2"><span className="text-text-secondary">Sprint 1 (9–15 Oct):</span><span className="font-semibold text-success">Fase activa</span></div>
              <div className="flex items-center justify-between gap-2"><span className="text-text-secondary">Sprint 2 (16–21 Oct):</span><span className="text-text-tertiary">Backend & HU02/HU03</span></div>
              <div aria-hidden="true" className="mt-1 h-1.5 w-full overflow-hidden rounded-full border border-subtle bg-surface"><div className="h-full w-1/3 bg-accent" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-subtle pt-8 font-mono text-xs text-text-tertiary sm:flex-row">
          <p>© 2026 Portfolio Promoción Directa. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4"><span>React + TypeScript</span><span aria-hidden="true">·</span><span>Tailwind CSS</span></div>
        </div>
      </div>
    </footer>
  )
}
