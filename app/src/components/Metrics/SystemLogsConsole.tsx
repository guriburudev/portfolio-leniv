import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface LogEntry {
  id: string
  timestamp: string
  tag: 'INFO' | 'MAILING' | 'CRUD' | 'AUTH'
  message: string
}

export default function SystemLogsConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // 1. Cargar últimos logs históricos
    const fetchInitialLogs = async () => {
      const { data } = await supabase
        .from('traffic_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        const mappedLogs: LogEntry[] = data.reverse().map((item) => {
          const time = new Date(item.created_at).toLocaleTimeString('es-AR')
          const isAuth = Boolean(item.user_id)
          return {
            id: item.id || String(Math.random()),
            timestamp: time,
            tag: item.event_type === 'login' ? 'AUTH' : isAuth ? 'INFO' : 'MAILING',
            message: `Evento [${item.event_type}] registrado en la plataforma ${
              item.user_id ? `(User ID: ${item.user_id})` : '(Anónimo)'
            }`,
          }
        })
        setLogs(mappedLogs)
      }
    }

    void fetchInitialLogs()

    const channel = supabase
      .channel('realtime_console_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'traffic_logs' },
        (payload) => {
          const newRow = payload.new
          const time = new Date(newRow.created_at).toLocaleTimeString('es-AR')
          const isAuth = Boolean(newRow.user_id)

          const newLog: LogEntry = {
            id: newRow.id || String(Math.random()),
            timestamp: time,
            tag: newRow.event_type === 'login' ? 'AUTH' : isAuth ? 'INFO' : 'MAILING',
            message: `Evento [${newRow.event_type}] detectado en tiempo real desde ${
              newRow.user_id ? 'Sesión Autenticada' : 'Tráfico Público'
            }`,
          }

          setLogs((prev) => [...prev.slice(-4), newLog]) // Mantiene siempre los últimos 5
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm" data-purpose="telemetry-logs-widget">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-text-primary font-mono uppercase tracking-wide">
            Telemetría en Tiempo Real
          </h3>
        </div>
        <div className="text-xs font-mono text-text-secondary flex items-center gap-4">
          <span>PostgreSQL: <strong className="text-emerald-400 font-semibold">Connected</strong></span>
          <span>WebSockets: <strong className="text-emerald-400 font-semibold">Active</strong></span>
          <span>Logs Engine: <strong className="text-cyan font-semibold">Listening</strong></span>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-2 border border-slate-800 overflow-x-auto shadow-inner min-h-[110px]">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">Esperando eventos en tiempo real...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-center gap-2 transition-all">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span
                className={`font-semibold ${
                  log.tag === 'AUTH'
                    ? 'text-cyan'
                    : log.tag === 'MAILING'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                [{log.tag}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </section>
  )
}