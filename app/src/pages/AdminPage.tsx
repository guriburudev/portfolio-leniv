import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type AdminPageProps = {
  theme: 'dark' | 'light'
  onThemeChange: () => void
}

export default function AdminPage({ theme, onThemeChange }: AdminPageProps) {
  const { profile, signOut } = useAuth()
  const adminEmail = profile?.email || 'alex.dev@portfolio.com'

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-text-primary selection:bg-accent selection:text-white">
      {/* ═══════════════════════════════════════════
          BEGIN: AdminTopNavbar
          ═══════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md transition-colors" data-purpose="admin-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Status Pill */}
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

            {/* Privilege Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MODO ADMIN · SESIÓN PRIVILEGIADA</span>
            </div>
          </div>

          {/* Center Link to Public View */}
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

          {/* Right Controls: Theme Toggle + User Info + Logout */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              aria-label="Cambiar tema de color"
              className="p-2 rounded-lg bg-surface border border-border text-cyan hover:bg-surface-hover hover:border-cyan/50 transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
              onClick={onThemeChange}
              title={theme === 'dark' ? 'Modo Oscuro Activo' : 'Modo Claro Activo'}
              type="button"
            >
              {theme === 'dark' ? (
                /* Sun Icon */
                <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>

            {/* Admin Profile Pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-cyan flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                AD
              </div>
              <div className="text-left text-xs leading-none">
                <span className="block font-semibold text-text-primary">{adminEmail}</span>
                <span className="text-[10px] text-accent font-mono font-medium">SuperAdmin</span>
              </div>
            </div>

            {/* Secure Logout Button */}
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

      {/* ═══════════════════════════════════════════
          BEGIN: MainContent
          ═══════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" data-purpose="admin-main-hub">
        {/* BEGIN: AdminHeroSection */}
        <section className="space-y-6" data-purpose="admin-hero-header">
          {/* Header Titles & Breadcrumbs */}
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
                Sprint 2 &amp; 3 Ready
              </span>
              <button
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-accent hover:bg-accent-hover text-white shadow-sm shadow-accent/20 transition-all"
                type="button"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Sincronizar
              </button>
            </div>
          </div>

          {/* Quick KPI Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-grid">
            {/* KPI 1 */}
            <div className="p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Mensajes Nuevos</span>
                <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">HU07</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">4</span>
                <span className="text-xs font-semibold text-amber-500 font-mono px-1.5 py-0.5 rounded bg-amber-500/10">1 urgente</span>
              </div>
              <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
                <span className="text-emerald-500 font-bold">+2</span> recibidos hoy vía Resend
              </div>
            </div>

            {/* KPI 2 */}
            <div className="p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Usuarios Activos</span>
                <span className="p-1.5 rounded-md bg-cyan/10 text-cyan border border-cyan/20 text-xs font-mono font-bold">HU08</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">28</span>
                <span className="text-xs font-semibold text-cyan font-mono px-1.5 py-0.5 rounded bg-cyan/10">Demos Auth</span>
              </div>
              <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
                <span className="text-emerald-500 font-bold">100%</span> verificación JWT OK
              </div>
            </div>

            {/* KPI 3 */}
            <div className="p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Proyectos Publicados</span>
                <span className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">HU09/10</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">6</span>
                <span className="text-xs font-semibold text-text-secondary font-mono px-1.5 py-0.5 rounded bg-elevated">En Producción</span>
              </div>
              <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
                <span className="text-cyan font-bold">Bento Grid</span> responsive sincronizado
              </div>
            </div>

            {/* KPI 4 */}
            <div className="p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Estado APIs / DB</span>
                <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">HEALTH</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.98%</span>
                <span className="text-xs font-semibold text-text-tertiary font-mono">Uptime</span>
              </div>
              <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                PostgreSQL &amp; Redis activos
              </div>
            </div>
          </div>
        </section>
        {/* END: AdminHeroSection */}

        {/* BEGIN: BentoHubCardsSection */}
        <section className="space-y-6" data-purpose="three-major-management-cards">
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
            {/* TARJETA 1: HU07 - MAILING OPERATIVO */}
            <article className="rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-purpose="card-hu07-mailing">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    HU07 · MAILING OPERATIVO
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white animate-pulse shadow-sm">
                    4 Nuevos
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Bandeja de Entrada &amp; Respuesta
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Visualiza consultas recibidas y respóndelas directamente vía Resend/SendGrid para dar seguimiento a reclutadores y clientes por correo electrónico sin salir de la plataforma.
                  </p>
                </div>

                {/* Feed de Emails */}
                <div className="rounded-xl bg-elevated border border-border p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary pb-1.5 border-b border-border-subtle">
                    <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Emails entrantes
                    </span>
                    <span className="text-[10px] text-text-tertiary font-sans bg-surface border border-border px-1.5 py-0.5 rounded">Resend Webhook</span>
                  </div>

                  {/* Email 1 */}
                  <div className="p-2.5 rounded-lg bg-surface border border-amber-500/30 hover:border-amber-500 transition-all space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary truncate text-[11px]">Empresa Tech Corp</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/25">No leído</span>
                    </div>
                    <p className="text-[10px] text-text-secondary truncate font-sans">&quot;Propuesta técnica: Consulta para integración de microservicios fullstack...&quot;</p>
                    <div className="flex items-center justify-between text-[9px] text-text-tertiary pt-1 border-t border-border-subtle font-mono">
                      <span>hace 24 min</span>
                      <span className="text-cyan font-semibold cursor-pointer hover:underline">Responder vía SMTP →</span>
                    </div>
                  </div>

                  {/* Email 2 */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border hover:border-border-strong transition-all space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text-primary truncate text-[11px]">María Gómez (Lead Recruiter)</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Respondido</span>
                    </div>
                    <p className="text-[10px] text-text-secondary truncate font-sans">&quot;Entrevista Lead Fullstack programada para este Jueves a las 15:00 UTC-3.&quot;</p>
                    <div className="flex items-center justify-between text-[9px] text-text-tertiary pt-1 border-t border-border-subtle font-mono">
                      <span>ayer 18:32</span>
                      <span className="text-text-tertiary">Copia guardada</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-text-tertiary">
                    <button className="hover:text-cyan transition-colors flex items-center gap-1 font-medium" type="button">
                      Filtrar por fecha
                    </button>
                    <button className="hover:text-cyan transition-colors flex items-center gap-1 font-medium" type="button">
                      Exportar CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-accent/20 transition-all duration-200" type="button">
                  <span>Abrir Bandeja Operativa</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </article>

            {/* TARJETA 2: HU08 - GESTIÓN DE USUARIOS */}
            <article className="rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-purpose="card-hu08-user-access">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-cyan/10 border border-cyan/20 text-cyan">
                    HU08 · CONTROL DE ACCESO
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-elevated text-text-secondary border border-border">
                    28 Cuentas
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Panel de Usuarios Registrados
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Monitorea y administra a los profesionales y empresas que crearon una cuenta con JWT para evaluar las demostraciones interactivas y código privado.
                  </p>
                </div>

                <div className="rounded-xl bg-elevated border border-border p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary pb-1.5 border-b border-border-subtle">
                    <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                      <span className="w-2 h-2 rounded-full bg-cyan" />
                      Sesiones Activas (JWT)
                    </span>
                    <span className="text-[10px] text-text-tertiary font-sans bg-surface border border-border px-1.5 py-0.5 rounded">Argon2 Hash</span>
                  </div>

                  {/* User Row 1 */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border hover:border-border-strong transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-[10px] font-bold shrink-0 border border-cyan/25">
                        CR
                      </div>
                      <div className="truncate">
                        <p className="text-[11px] font-bold text-text-primary truncate">Carlos R. (Tech Lead)</p>
                        <p className="text-[9px] text-text-tertiary truncate">carlos.r@globaltech.io</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Activo</span>
                      <p className="text-[8px] text-text-tertiary mt-0.5 font-mono">Demo Viewer</p>
                    </div>
                  </div>

                  {/* User Row 2 */}
                  <div className="p-2.5 rounded-lg bg-surface border border-border hover:border-border-strong transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center text-[10px] font-bold shrink-0 border border-purple-500/25">
                        SL
                      </div>
                      <div className="truncate">
                        <p className="text-[11px] font-bold text-text-primary truncate">Sofia López (Staff Eng)</p>
                        <p className="text-[9px] text-text-tertiary truncate">sofia@talentpartners.dev</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Activo</span>
                      <p className="text-[8px] text-text-tertiary mt-0.5 font-mono">Full Code Access</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button className="text-rose-500 hover:text-rose-400 font-medium transition-colors flex items-center gap-1" type="button">
                      Suspender cuenta
                    </button>
                    <button className="text-text-tertiary hover:text-cyan font-medium transition-colors flex items-center gap-1" type="button">
                      Auditar JWT
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-accent/20 transition-all duration-200" type="button">
                  <span>Gestionar Cuentas de Acceso</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </article>

            {/* TARJETA 3: HU09 & HU10 - CRUD PROYECTOS */}
            <article className="rounded-2xl bg-surface border border-border hover:border-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md group" data-purpose="card-hu09-hu10-projects-crud">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    HU09/HU10 · CRUD &amp; ASSETS
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-elevated text-purple-400 border border-purple-500/20">
                    6 Proyectos Activos
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                    Gestión de Contenido de Proyectos
                  </h3>
                  <p className="text-xs text-text-secondary font-normal leading-relaxed mt-1">
                    Formularios interactivos para Crear, Leer, Editar y Eliminar proyectos del portfolio. Incluye gestor de subida para fotos de portada, diagramas y videos demo.
                  </p>
                </div>

                <div className="rounded-xl bg-elevated border border-border p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary pb-1.5 border-b border-border-subtle">
                    <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Proyecto Seleccionado
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold">Producción</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface border border-border hover:border-border-strong transition-all space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary text-[11px]">Plataforma Analítica Multi-rol</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-cyan/10 text-cyan border border-cyan/20">Sprint 1</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      <span className="text-[9px] px-1.5 py-0.2 bg-elevated border border-border rounded font-medium text-text-secondary">React 19</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-elevated border border-border rounded font-medium text-text-secondary">Node.js</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-elevated border border-border rounded font-medium text-text-secondary">PostgreSQL</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[9px] text-text-tertiary">
                      <span className="flex items-center gap-1 text-text-secondary font-medium">
                        <svg className="w-3 h-3 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        3 imágenes
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-text-secondary font-medium">
                        <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        1 video demo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <button className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1" type="button">
                      + Crear Proyecto
                    </button>
                    <div className="flex items-center gap-2 font-medium">
                      <button className="text-text-tertiary hover:text-text-primary transition-colors" type="button">Editar</button>
                      <span className="text-border">|</span>
                      <button className="text-text-tertiary hover:text-purple-400 transition-colors" type="button">Multimedia Cloud</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-600/30 hover:shadow transition-all duration-200" type="button">
                  <span>Abrir Editor de Proyectos (CRUD)</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </article>
          </div>
        </section>
        {/* END: BentoHubCardsSection */}

        {/* BEGIN: SystemLogsTelemetrySection */}
        <section className="space-y-6" data-purpose="analytics-metrics-sprint3-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-mono font-medium mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                SPRINT 3 · HU11 &amp; HU12
              </div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <span className="text-cyan font-mono">#02</span> Métricas &amp; Gráficos de Tráfico
              </h2>
              <p className="text-xs text-text-tertiary font-mono mt-0.5">
                Espacio reservado para contadores independientes (visitas públicas vs logins de usuarios) y visualizaciones analíticas con Chart.js / Recharts.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Pendiente de implementación en Sprint 3 (22 - 25 Oct)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualización 1 */}
            <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-cyan/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-cyan/10 border border-cyan/20 text-cyan">
                      HU11 · CONTADORES INDEPENDIENTES
                    </span>
                    <h3 className="text-base font-bold text-text-primary">Evolución de Tráfico &amp; Sesiones (Público vs Auth)</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">Telemetry v2</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-elevated border border-border">
                    <div className="text-[10px] font-mono uppercase text-text-tertiary">Visitas Portfolio</div>
                    <div className="text-xl font-extrabold text-text-primary mt-1">1,420 <span className="text-[10px] text-emerald-400 font-normal">+18%</span></div>
                    <div className="text-[9px] font-mono text-text-tertiary mt-0.5">Contador anónimo Redis</div>
                  </div>
                  <div className="p-3 rounded-lg bg-elevated border border-border">
                    <div className="text-[10px] font-mono uppercase text-text-tertiary">Sesiones Reclutadores</div>
                    <div className="text-xl font-extrabold text-cyan mt-1">148 <span className="text-[10px] text-cyan font-normal">JWT act</span></div>
                    <div className="text-[9px] font-mono text-text-tertiary mt-0.5">Logins validados DB</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-elevated border border-dashed border-border flex flex-col items-center justify-center space-y-3 min-h-[170px]">
                  <div className="w-full flex items-end justify-between gap-2 h-24 px-4 pt-4 border-b border-border">
                    <div className="w-full bg-border-strong rounded-t h-[35%]" />
                    <div className="w-full bg-cyan/30 rounded-t h-[55%]" />
                    <div className="w-full bg-border-strong rounded-t h-[45%]" />
                    <div className="w-full bg-cyan/50 rounded-t h-[75%]" />
                    <div className="w-full bg-border-strong rounded-t h-[60%]" />
                    <div className="w-full bg-cyan rounded-t h-[90%]" />
                    <div className="w-full bg-accent rounded-t h-[70%]" />
                  </div>
                  <div className="flex items-center justify-between w-full text-[10px] font-mono text-text-tertiary px-2">
                    <span>Mockup Chart.js · 7 días</span>
                    <div className="flex items-center gap-3">
                      <span><span className="inline-block w-2 h-2 rounded-full bg-border-strong mr-1" />Público</span>
                      <span><span className="inline-block w-2 h-2 rounded-full bg-cyan mr-1" />Autenticado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Blueprint de visualización temporal</span>
                <span className="text-cyan font-semibold">Sprint 3 Ready</span>
              </div>
            </div>

            {/* Visualización 2 */}
            <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-purple-400/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      HU12 · DASHBOARD DE GRÁFICOS
                    </span>
                    <h3 className="text-base font-bold text-text-primary">Distribución de Interacciones por Módulo</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">Recharts / Donut</span>
                </div>

                <div className="p-4 rounded-xl bg-elevated border border-dashed border-border flex flex-col sm:flex-row items-center justify-around gap-4 min-h-[170px]">
                  <div className="relative w-28 h-28 rounded-full border-8 border-accent flex items-center justify-center shrink-0">
                    <div className="w-16 h-16 rounded-full border-4 border-cyan flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500" />
                    </div>
                  </div>
                  <div className="space-y-2 text-xs font-mono w-full sm:w-auto">
                    <div className="flex items-center justify-between gap-4 p-1.5 rounded bg-surface border border-border">
                      <span className="flex items-center gap-1.5 text-text-secondary"><span className="w-2 h-2 rounded-full bg-accent" />Mailing &amp; Consultas</span>
                      <span className="font-bold text-text-primary">48%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 p-1.5 rounded bg-surface border border-border">
                      <span className="flex items-center gap-1.5 text-text-secondary"><span className="w-2 h-2 rounded-full bg-cyan" />Demos &amp; Auth JWT</span>
                      <span className="font-bold text-text-primary">32%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 p-1.5 rounded bg-surface border border-border">
                      <span className="flex items-center gap-1.5 text-text-secondary"><span className="w-2 h-2 rounded-full bg-purple-500" />Interacción Proyectos</span>
                      <span className="font-bold text-text-primary">20%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" />Segmentación interactiva modular</span>
                <span className="text-purple-400 font-semibold">Sprint 3 Design Spec</span>
              </div>
            </div>
          </div>
        </section>

        {/* Consola Operativa y Telemetría */}
        <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm" data-purpose="telemetry-logs-widget">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-text-primary font-mono uppercase tracking-wide">
                Consola Operativa y Telemetría en Tiempo Real
              </h3>
            </div>
            <div className="text-xs font-mono text-text-secondary flex items-center gap-4">
              <span>PostgreSQL: <strong className="text-emerald-400 font-semibold">Connected</strong></span>
              <span>Resend Webhook: <strong className="text-emerald-400 font-semibold">Active</strong></span>
              <span>Auth Daemon: <strong className="text-cyan font-semibold">Listening :5000</strong></span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800 overflow-x-auto shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">[14:28:10.042]</span>
              <span className="text-emerald-400 font-semibold">[INFO]</span>
              <span className="text-slate-300">JWT Token verify success for demo viewer: <strong className="text-white font-medium">sofia@talentpartners.dev</strong> (Scope: Read_Private_Repos)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">[14:26:01.890]</span>
              <span className="text-cyan font-semibold">[MAILING]</span>
              <span className="text-slate-300">New message dispatched via Resend API to <strong className="text-white font-medium">{adminEmail}</strong> (Status 200 OK)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">[14:15:33.119]</span>
              <span className="text-purple-400 font-semibold">[CRUD]</span>
              <span className="text-slate-300">Project <strong className="text-purple-300 font-medium">#01 Plataforma Analítica</strong> cache refreshed. CDN invalidation cleared in 32ms.</span>
            </div>
          </div>
        </section>
        {/* END: SystemLogsTelemetrySection */}
      </main>

      {/* ═══════════════════════════════════════════
          BEGIN: AdminFooter
          ═══════════════════════════════════════════ */}
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
            <span className="text-text-tertiary">HU01 · HU07 · HU08 · HU09/HU10</span>
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
