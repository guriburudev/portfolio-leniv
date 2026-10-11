import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import About from './components/About'

export default function App() {
  // El tema inicial respeta la elección anterior; si no existe, se usa el modo oscuro del manual.
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  // Aplicamos el atributo que activa los tokens del tema y guardamos la preferencia localmente.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen overflow-hidden bg-canvas text-text-primary">
      <Navbar theme={theme} onThemeChange={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main>
        <Hero />
        <About />
        <BentoGrid />
        {/* El formulario y su persistencia pertenecen a HU03, a cargo de otro integrante. */}
        <section id="contacto" aria-label="Sección reservada para HU03" className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="font-mono text-sm text-text-tertiary">--Aquí corresponde la HU03--</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
