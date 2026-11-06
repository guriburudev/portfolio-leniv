import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import TrafficMetricsSection from '../components/Metrics/TrafficMetricsSections'
import OverviewKPIsSection, { type OverviewKPIsRef } from '../components/Metrics/OverviewKPIsSection'
import SystemLogsConsole from '../components/Metrics/SystemLogsConsole'

type AdminPageProps = {
  theme: 'dark' | 'light'
  onThemeChange: () => void
}

export default function AdminPage({ theme, onThemeChange }: AdminPageProps) {
  const { profile, signOut } = useAuth()
  const adminEmail = profile?.email || 'alex.dev@portfolio.com'

  const kpisRef = useRef<OverviewKPIsRef>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Sincronización limpia SPA en segundo plano
  const handleSync = async () => {
    setIsSyncing(true)
    if (kpisRef.current) {
      await kpisRef.current.refresh()
    }
    setTimeout(() => setIsSyncing(false), 500)
  }

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-text-primary selection:bg-accent selection:text-white">
      {/* AdminTopNavbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md transition-colors" data-purpose="admin-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link className="flex items-center gap-2 group" to="/" title="Portfolio Fullstack">
              <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center font-mono font-bold text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                &lt;A/&gt;
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                  Alex.Dev <span className="text-[10px] bg-elevated text-text-secondary font-mono px-1.5 py-0.5 rounded border border-border-subtle">v1.0</span>
                </span>
                <span className="block text-[10px] font-mono text-text-tertiary tracking-wider uppercase font-semibold">
                  Fullstack Admin
                </span>
              </div>
            </Link>

            <div className="h-5 w-px bg-border hidden md:block" />

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MODO ADMIN · SESIÓN PRIVILEGIADA</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-text-secondary">
            <Link
              className="flex items-center gap-1.5 hover:text-accent transition-colors py-1 px-2.5 rounded-md hover:bg-surface-hover font-medium"
              to="/"
            >
              <svg className="w-3.5 h-3.5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Volver al Portfolio público
            </Link>
            <span className="text-text-tertiary">/</span>
            <span className="text-text-primary font-semibold">Hub Operativo</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Cambiar tema de color"
              className="p-2 rounded-lg bg-surface border border-border text-cyan hover:bg-surface-hover hover:border-cyan/50 transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
              onClick={onThemeChange}
              title={theme === 'dark' ? 'Modo Oscuro Activo' : 'Modo Claro Activo'}
              type="button"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-cyan flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                AD
              </div>
              <div className="text-left text-xs leading-none">
                <span className="block font-semibold text-text-primary">{adminEmail}</span>
                <span className="text-[10px] text-accent font-mono font-medium">SuperAdmin</span>
              </div>
            </div>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all focus:outline-none"
              onClick={() => void signOut()}
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" data-purpose="admin-main-hub">
        <section className="space-y-6" data-purpose="admin-hero-header" data-reveal="">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-accent-surface border border-accent/25 text-accent font-mono text-xs font-medium mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                DASHBOARD CENTRAL // PORTFOLIO CMS &amp; MAILING
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
                Panel Operativo de Administración
              </h1>
              <p className="text-sm sm:text-base text-text-secondary font-mono mt-1 max-w-2xl">
                Centro de control exclusivo para el dueño del portfolio. Administra consultas entrantes, usuarios de demos y el catálogo dinámico de proyectos.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-surface border border-border text-text-secondary shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Plataforma activa
              </span>
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-accent hover:bg-accent-hover text-white shadow-sm shadow-accent/20 transition-all disabled:opacity-50"
                onClick={handleSync}
                disabled={isSyncing}
                type="button"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
          </div>

          <OverviewKPIsSection ref={kpisRef} />
        </section>

        <section className="space-y-6" data-purpose="three-major-management-cards" data-reveal="">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <span className="text-cyan font-mono">#01</span>
                Módulos de Gestión Operativa
              </h2>
              <p className="text-xs text-text-tertiary font-mono mt-0.5">
                Acceso integral a microservicios de correos, autenticación de observadores y catálogo de proyectos.
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono text-text-secondary bg-surface border border-border px-3 py-1.5 rounded-lg shadow-sm">
              Arquitectura Desacoplada REST / JWT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="motion-surface rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-reveal="">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    MENSAJES · CONTACTO
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white animate-pulse shadow-sm">
                    Live Webhook
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Bandeja de Entrada &amp; Respuesta
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Visualiza consultas recibidas y respóndelas directamente vía Resend/SendGrid para dar seguimiento a reclutadores y clientes por correo electrónico.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button className="w-full py-2.5 px-4 rounded-xl bg-warning hover:bg-warning/80 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200" type="button">
                  <span className="text-white dark:text-black">Abrir Bandeja Operativa</span>
                </button>
              </div>
            </article>

            <article className="motion-surface rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-reveal="">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-cyan/10 border border-cyan/20 text-cyan">
                    CUENTAS · ACCESO
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-elevated text-text-secondary border border-border">
                    JWT Managed
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Panel de Usuarios Registrados
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Monitorea y administra a los profesionales y empresas que crearon una cuenta para evaluar las demostraciones interactivas y código privado.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to="/admin/users" className="w-full py-2.5 px-4 rounded-xl bg-green-500 hover:bg-yellow-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/30 hover:shadow transition-all duration-200">
                  <span className="text-white dark:text-black">Abrir Gestor de Usuarios</span>
                  <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </Link>
              </div>
            </article>

            <article className="motion-surface rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-reveal="">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    PROYECTOS · CONTENIDO
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-elevated text-purple-400 border border-purple-500/20">
                    Supabase Storage
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Gestión de Contenido de Proyectos
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Formularios interactivos para Crear, Leer, Editar y Eliminar proyectos del portfolio. Incluye gestor de subida para fotos y videos.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to="/admin/projects" className="w-full py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/30 hover:shadow transition-all duration-200">
                  <span className="text-white dark:text-black">Abrir Editor de Proyectos (CRUD)</span>
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Telemetría y Gráficos */}
        <TrafficMetricsSection />

        {/* Consola Operativa */}
          <div data-reveal=""><SystemLogsConsole /></div>
      </main>

      {/* AdminFooter */}
      <footer className="border-t border-border bg-surface text-xs font-mono text-text-secondary transition-colors mt-auto" data-purpose="admin-footer-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-text-primary font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              SuperAdmin: {adminEmail.split('@')[0]}
            </span>
            <span className="text-border">|</span>
            <span className="text-text-secondary font-medium">Portfolio Core v1.0.0</span>
            <span className="text-border">|</span>
            <span className="text-text-tertiary">Módulos operativos</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              PostgreSQL DB Sync OK
            </span>
            <span className="text-border">|</span>
            <span className="text-text-secondary font-medium">WCAG AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
