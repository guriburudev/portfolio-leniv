// Enlaces internos para recorrer las secciones principales de la landing.
const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
]

type NavbarProps = {
  theme: 'dark' | 'light'
  onThemeChange: () => void
}

// Barra fija con navegación adaptable y un control real para alternar el tema.
export default function Navbar({ theme, onThemeChange }: NavbarProps) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-default bg-overlay backdrop-blur-md">
      <nav aria-label="Navegación principal" className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <a aria-label="Portfolio, ir al inicio" className="font-mono text-lg font-bold tracking-[-0.08em] text-text-primary" href="#inicio">
          <span className="text-accent">&lt;</span>GC<span className="text-accent"> /&gt;</span>
        </a>
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} className="text-sm text-text-secondary hover:text-text-primary" href={link.href}>{link.label}</a>
          ))}
        </div>
        <button aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} aria-pressed={theme === 'light'} className="grid size-10 place-items-center rounded-full border border-default bg-surface text-text-secondary hover:border-strong hover:text-text-primary" onClick={onThemeChange} type="button">
          <span aria-hidden="true" className="text-lg">{theme === 'dark' ? '☼' : '☾'}</span>
        </button>
      </nav>
      <div className="flex justify-center gap-6 border-t border-subtle px-4 py-2 md:hidden">
        {links.map((link) => (
          <a key={link.href} className="text-xs text-text-secondary" href={link.href}>{link.label}</a>
        ))}
      </div>
    </header>
  )
}
