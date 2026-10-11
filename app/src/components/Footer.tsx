// Cierre de página con accesos sociales y texto de derechos reservados.
const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
]

export default function Footer() {
  return (
    <footer className="border-t border-default px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-xs text-text-tertiary">© 2026 Portfolio Fullstack. Todos los derechos reservados.</p>
        <nav aria-label="Redes sociales" className="flex items-center gap-6">
          {socials.map((social) => (
            <a key={social.label} aria-label={`Visitar ${social.label}`} className="text-sm text-text-secondary hover:text-text-primary" href={social.href}>
              {social.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
