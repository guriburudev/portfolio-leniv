import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navegación flotante de la referencia, con un menú compacto para pantallas pequeñas.
// Los enlaces usan "/#..." para que también funcionen desde /login, /register, etc.
const links = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'Sobre mí', href: '/#sobre-mi' },
  { label: 'Contacto', href: '/#contacto' },
]

type NavbarProps = {
  theme: 'dark' | 'light'
  onThemeChange: () => void
}

const authLink =
  'inline-flex items-center justify-center rounded-md border border-default bg-surface px-3 py-2 text-xs font-semibold text-text-primary hover:border-accent'

// La barra conserva el control de tema que se conecta a los tokens globales.
export default function Navbar({ theme, onThemeChange }: NavbarProps) {
  const { session, isAdmin, signOut } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.getElementById(href.split('#')[1]))
      .filter((section): section is HTMLElement => section !== null)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleSections[0]) {
          const nextSection = visibleSections[0].target.id
          setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection)
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const handleSectionClick = (section: string) => setActiveSection(section)
  const sectionLinkClass = (section: string) =>
    `rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-500 ease-in-out ${activeSection === section ? 'border-accent/30 bg-accent-surface text-text-primary' : 'border-transparent text-text-secondary hover:bg-surface hover:text-text-primary'}`

  return (
    <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl sm:inset-x-6">
      <nav aria-label="Navegación principal" className="relative rounded-xl border border-default bg-overlay px-4 py-3 shadow-lg backdrop-blur-xl sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a aria-label="Alex Dev, ir al inicio" className="flex shrink-0 items-center gap-2.5" href="/#inicio">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-md bg-accent font-mono text-base font-bold text-text-on-accent">&lt;A/&gt;</span>
            <span className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-text-primary">Alex Dev<span className="text-accent">.</span></span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">Fullstack Eng</span>
            </span>
          </a>

          <div className="order-3 flex w-full items-center justify-center gap-1 rounded-lg border border-subtle bg-surface-hover p-1 lg:order-none lg:w-auto">
            {links.map((link) => (
              <a key={link.href} aria-current={activeSection === link.href.split('#')[1] ? 'location' : undefined} className={sectionLinkClass(link.href.split('#')[1])} href={link.href} onClick={() => handleSectionClick(link.href.split('#')[1])}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button aria-label="Alternar tema oscuro y claro" aria-pressed={theme === 'light'} className="grid size-9 place-items-center rounded-md border border-default bg-surface text-text-secondary hover:border-accent hover:text-text-primary" onClick={onThemeChange} type="button">
              {theme === 'dark' ? (
                <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.35 15.35A9 9 0 0 1 8.65 3.65 9 9 0 1 0 20.35 15.35Z" />
                </svg>
              )}
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-accent/20 bg-accent-surface px-2.5 py-1 font-mono text-[11px] font-medium text-accent xl:flex">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-success" /> Open to work
            </span>

            {session ? (
              <>
                {isAdmin && <Link className={authLink} to="/admin">Admin</Link>}
                <button className={authLink} onClick={() => void signOut()} type="button">Salir</button>
              </>
            ) : (
              <Link className={authLink} to="/login">Iniciar sesión</Link>
            )}

            <a className="hidden items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-text-on-accent hover:bg-accent-hover sm:inline-flex sm:px-4" href="/#contacto">
              Conectar <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

      </nav>
    </header>
  )
}
