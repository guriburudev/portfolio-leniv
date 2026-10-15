import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import BentoGrid from './components/BentoGrid'
import About from './components/About'

import { GuestOnly, RequireAdmin, RequireAuth } from './components/RouteGuards'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import AdminPage from './pages/AdminPage'

import ContactSection from './components/ContactSection'
import ContactSection from './components/Contact/ContactSection'

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
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-canvas text-text-primary">
      {/* Fondo ambiental estático y decorativo de las referencias visuales. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-accent-surface blur-[140px]" />
        <div className="absolute right-[-10%] top-[45%] h-[500px] w-[500px] rounded-full bg-accent-surface blur-[160px]" />
        <div className="bg-grid-pattern absolute inset-0" />
      </div>
      <Navbar theme={theme} onThemeChange={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-grow px-4 pb-20 pt-32 sm:px-6">
        <Routes>
          {/* Página principal (la de siempre) */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <BentoGrid />
                <About />
                <ContactSection />
              </>
            }
          />

          {/* Solo visitantes sin sesión: con sesión redirige según rol / proyecto pendiente */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Requiere sesión: detalle del proyecto (destino del deep link) */}
          <Route element={<RequireAuth />}>
            <Route path="/work/:id" element={<ProjectDetailPage />} />
          </Route>

          {/* Requiere rol admin */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}