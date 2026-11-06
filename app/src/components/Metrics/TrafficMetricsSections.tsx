import { useEffect, useState, useCallback } from 'react'
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
  const [selectedRange, setSelectedRange] = useState<number>(7) // 7, 14 o 30 días
  const [stats, setStats] = useState<TrafficStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null)
  const [activeBarDay, setActiveBarDay] = useState<{
    date: string
    publicViews: number
    authViews: number
  } | null>(null)

  // Cargar métricas según el rango seleccionado
  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    const data = await getDashboardMetrics(selectedRange)
    setStats(data)
    setLoading(false)
  }, [selectedRange])

  useEffect(() => {
    void fetchMetrics()

    // Realtime Postgres listener
    const channel = supabase
      .channel(`traffic_logs_realtime_${selectedRange}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'traffic_logs' },
        () => void fetchMetrics()
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [fetchMetrics, selectedRange])

  const activeModuleItem =
    activeModuleIndex !== null && stats ? stats.moduleDistribution[activeModuleIndex] : null

  return (
    <section className="space-y-6" data-purpose="analytics-metrics-sprint3-section">
      {/* Encabezado y Selector de Rango de Fechas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="text-cyan font-mono">Analytics: </span> Métricas &amp; Gráficos de Tráfico
          </h2>
          <p className="text-xs text-text-tertiary font-mono mt-0.5">
            Telemetría y tráfico parametrizado que recibe el portfolio
          </p>
        </div>

        {/* Filtros Parametrizados */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-lg bg-surface border border-border p-1 gap-1 text-xs font-mono">
            {[
              { label: '7 días', value: 7 },
              { label: '14 días', value: 14 },
              { label: '30 días', value: 30 },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedRange === range.value
                    ? 'bg-accent text-white shadow-sm font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
                type="button"
              >
                {range.label}
              </button>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {loading || !stats ? (
        <div className="rounded-2xl border border-border bg-surface p-6 font-mono text-xs text-text-tertiary">
          Cargando telemetría de {selectedRange} días…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* VISTA 1: BARRAS PARAMETRIZADAS */}
          <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-cyan/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">
                  Evolución de Tráfico &amp; Sesiones (Público vs Auth)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">
                  Últimos {selectedRange} días
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

              {/* Gráfico de Barras con Recharts */}
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
                        tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                        interval={selectedRange > 14 ? 3 : 0}
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
                      <span>Rango: {selectedRange} días</span>
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Consulta parametrizada Postgres
              </span>
              <span className="text-cyan font-semibold">Live Stream</span>
            </div>
          </div>

          {/* VISTA 2: DONUT PARAMETRIZADO */}
          <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-purple-400/50 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">
                  Distribución de Interacciones por Módulo
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated text-text-secondary border border-border">
                  Segmentación ({selectedRange}d)
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
                Interacciones en {selectedRange} días
              </span>
              <span className="text-purple-400 font-semibold font-mono">Parametrizado OK</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}