import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { getDashboardMetrics, type TrafficStats } from '../../services/analyticsService'

export default function TrafficMetricsSection() {
  const [stats, setStats] = useState<TrafficStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [activeBarDay, setActiveBarDay] = useState<{
    date: string
    publicViews: number
    authViews: number
  } | null>(null)

  // Función para obtener las métricas actualizadas
  const fetchMetrics = async () => {
    const data = await getDashboardMetrics()
    setStats(data)
    setLoading(false)
  }

  useEffect(() => {
    // 1. Carga inicial
    void fetchMetrics()

    // 2. Suscripción a cambios en tiempo real vía WebSockets
    const channel = supabase
      .channel('traffic_logs_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'traffic_logs',
        },
        () => {
          // Cada vez que se inserta un log, recalcula y actualiza los gráficos
          void fetchMetrics()
        }
      )
      .subscribe()

    // 3. Limpieza de la suscripción al desmontar el componente
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  if (loading || !stats) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 font-mono text-xs text-text-tertiary">
        Cargando telemetría de tráfico…
      </div>
    )
  }

  const activeModuleItem =
    activeModuleIndex !== null ? stats.moduleDistribution[activeModuleIndex] : null

  return (
    <section className="space-y-6" data-purpose="analytics-metrics-sprint3-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="text-cyan font-mono">Analytics: </span> Métricas &amp; Gráficos de Tráfico
          </h2>
          <p className="text-xs text-text-tertiary font-mono mt-0.5">
            Telemetría y tráfico que recibe el portfolio
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Realtime WebSocket Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VISTA 1: BARRAS INTERACTIVAS EN TIEMPO REAL */}
        <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-cyan/50 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  Evolución de Tráfico &amp; Sesiones (Público vs Auth)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">
                Live Data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-text-tertiary">
                  Visitas Portfolio
                </div>
                <div className="text-xl font-extrabold text-text-primary mt-1">
                  {stats.totalPageViews.toLocaleString()}{' '}
                  <span className="text-[10px] text-emerald-400 font-normal">+18%</span>
                </div>
                <div className="text-[9px] font-mono text-text-tertiary mt-0.5">
                  Contador anónimo
                </div>
              </div>
              <div className="p-3 rounded-lg bg-elevated border border-border">
                <div className="text-[10px] font-mono uppercase text-text-tertiary">
                  Sesiones Reclutadores
                </div>
                <div className="text-xl font-extrabold text-cyan mt-1">
                  {stats.totalLogins.toLocaleString()}{' '}
                  <span className="text-[10px] text-cyan font-normal">JWT act</span>
                </div>
                <div className="text-[9px] font-mono text-text-tertiary mt-0.5">
                  Logins validados DB
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-elevated border border-dashed border-border flex flex-col items-center justify-between space-y-2 min-h-[170px]">
              <div className="w-full h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.dailyTraffic}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    onMouseMove={(state) => {
                      if (state?.activePayload?.[0]?.payload) {
                        setActiveBarDay(state.activePayload[0].payload)
                      }
                    }}
                    onMouseLeave={() => setActiveBarDay(null)}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-md border border-border bg-surface p-2 shadow-lg font-mono text-[10px] space-y-1">
                              <p className="font-bold text-text-primary">{payload[0].payload.date}</p>
                              <p className="text-slate-300">Público: {payload[0].value}</p>
                              <p className="text-accent">Auth: {payload[1]?.value ?? 0}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="publicViews" name="Público" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="authViews" name="Autenticado" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between w-full text-[10px] font-mono text-text-tertiary px-1 border-t border-border pt-2">
                <div>
                  {activeBarDay ? (
                    <span className="text-text-primary font-bold">
                      {activeBarDay.date}:{' '}
                      <span className="text-slate-300">{activeBarDay.publicViews} púb</span> /{' '}
                      <span className="text-accent">{activeBarDay.authViews} auth</span>
                    </span>
                  ) : (
                    <span>Histórico 7 días</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-1" />
                    Público
                  </span>
                  <span>
                    <span className="inline-block w-2 h-2 rounded-full bg-accent mr-1" />
                    Autenticado
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Suscripción Realtime PostgreSQL
            </span>
            <span className="text-cyan font-semibold">Live Stream</span>
          </div>
        </div>

        {/* VISTA 2: DONUT EN TIEMPO REAL */}
        <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-purple-400/50 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  Distribución de Interacciones por Módulo
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">
                Segmentación
              </span>
            </div>

            <div className="p-4 rounded-xl bg-elevated border border-dashed border-border flex flex-col sm:flex-row items-center justify-around gap-6 min-h-[170px]">
              <div className="w-36 h-36 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.moduleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={52}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      onMouseEnter={(_, index) => setActiveModuleIndex(index)}
                      onMouseLeave={() => setActiveModuleIndex(null)}
                    >
                      {stats.moduleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          style={{
                            opacity:
                              activeModuleIndex === null || activeModuleIndex === index
                                ? 1
                                : 0.4,
                            transform:
                              activeModuleIndex === index ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center center',
                            transition: 'all 0.2s ease-in-out',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-mono font-extrabold text-text-primary">
                    {activeModuleItem ? `${activeModuleItem.value}%` : '100%'}
                  </span>
                  <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-wider">
                    {activeModuleItem ? activeModuleItem.name.split(' ')[0] : 'Total'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono w-full sm:w-auto">
                {stats.moduleDistribution.map((item, idx) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveModuleIndex(idx)}
                    onMouseLeave={() => setActiveModuleIndex(null)}
                    className={`flex items-center justify-between gap-4 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      activeModuleIndex === idx
                        ? 'bg-surface border-accent/40 shadow-sm scale-[1.02]'
                        : 'bg-surface/60 border-border hover:border-border-strong'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-text-secondary">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="font-bold text-text-primary ml-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Selección interactiva activada
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}