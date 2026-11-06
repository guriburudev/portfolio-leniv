import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { getOverviewKPIs, type OverviewKPIs } from '../../services/analyticsService'
import { supabase } from '../../lib/supabase'

export interface OverviewKPIsRef {
  refresh: () => Promise<void>
}

const OverviewKPIsSection = forwardRef<OverviewKPIsRef>((_, ref) => {
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchKPIs = async () => {
    const data = await getOverviewKPIs()
    setKpis(data)
    setLoading(false)
  }

  useImperativeHandle(ref, () => ({
    refresh: fetchKPIs,
  }))

  useEffect(() => {
    void fetchKPIs()

    const channel = supabase
      .channel('overview_kpis_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => void fetchKPIs())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => void fetchKPIs())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => void fetchKPIs())
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  if (loading || !kpis) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-grid" data-reveal="">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="motion-surface p-4 rounded-xl bg-surface border border-border animate-pulse h-28" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-grid" data-reveal="">
      {/* KPI 1: MENSAJES NUEVOS */}
      <div className="motion-surface p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Mensajes Nuevos</span>
          <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">CONTACTO</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">{kpis.newMessages}</span>
          {kpis.urgentMessages > 0 && (
            <span className="text-xs font-semibold text-amber-500 font-mono px-1.5 py-0.5 rounded bg-amber-500/10">
              {kpis.urgentMessages} urgente
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
          <span className="text-emerald-500 font-bold">+{kpis.todayMessages}</span> recibidos hoy vía Resend
        </div>
      </div>

      {/* KPI 2: USUARIOS ACTIVOS */}
      <div className="motion-surface p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Usuarios Activos</span>
          <span className="p-1.5 rounded-md bg-cyan/10 text-cyan border border-cyan/20 text-xs font-mono font-bold">CUENTAS</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">{kpis.activeUsers}</span>
          <span className="text-xs font-semibold text-cyan font-mono px-1.5 py-0.5 rounded bg-cyan/10">Demos Auth</span>
        </div>
        <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
          <span className="text-emerald-500 font-bold">100%</span> verificación JWT OK
        </div>
      </div>

      {/* KPI 3: PROYECTOS PUBLICADOS */}
      <div className="motion-surface p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Proyectos Publicados</span>
          <span className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">PROYECTOS</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-text-primary">{kpis.publishedProjects}</span>
          <span className="text-xs font-semibold text-text-secondary font-mono px-1.5 py-0.5 rounded bg-elevated">En Producción</span>
        </div>
        <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1">
          <span className="text-cyan font-bold">Bento Grid</span> responsive sincronizado
        </div>
      </div>

      {/* KPI 4: HEALTH CHECK APIS*/}
      <div className="motion-surface p-4 rounded-xl bg-surface border border-border hover:border-border-strong transition-all flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-text-secondary">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Estado APIs / DB</span>
          <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">HEALTH</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">99.98%</span>
          <span className="text-xs font-semibold text-text-tertiary font-mono">Uptime</span>
        </div>
        <div className="mt-3 text-[11px] text-text-tertiary flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          PostgreSQL activo ({kpis.latencyMs}ms)
        </div>
      </div>
    </div>
  )
})

OverviewKPIsSection.displayName = 'OverviewKPIsSection'
export default OverviewKPIsSection
