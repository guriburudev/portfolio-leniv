import { supabase } from '../lib/supabase'

export interface TrafficStats {
  totalPageViews: number
  totalLogins: number
  totalDemoViews: number
  dailyTraffic: { date: string; publicViews: number; authViews: number }[]
  moduleDistribution: { name: string; value: number; color: string }[]
}

export async function getDashboardMetrics(): Promise<TrafficStats> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // 1. Consultar eventos de los últimos 7 días
  const { data: logs, error } = await supabase
    .from('traffic_logs')
    .select('event_type, user_id, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())

  if (error || !logs || logs.length === 0) {
    // Si la tabla está vacía o da error, retorna 0 en lugar de crash
    return getZeroStats()
  }

  // Totales Analytics
  const totalPageViews = logs.filter((l) => l.event_type === 'page_view').length
  const totalLogins = logs.filter((l) => l.event_type === 'login').length
  const totalDemoViews = logs.filter((l) => l.event_type === 'demo_view').length

  const daysMap: Record<string, { publicViews: number; authViews: number }> = {}

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')
    daysMap[key] = { publicViews: 0, authViews: 0 }
  }

  logs.forEach((log) => {
    const d = new Date(log.created_at)
    const key = d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')
    
    if (daysMap[key]) {
      if (log.user_id) {
        daysMap[key].authViews += 1
      } else {
        daysMap[key].publicViews += 1
      }
    }
  })

  const dailyTraffic = Object.entries(daysMap).map(([date, data]) => ({
    date,
    publicViews: data.publicViews,
    authViews: data.authViews,
  }))

  const totalEvents = logs.length || 1

  const mailingCount = logs.filter((l) => l.event_type === 'page_view' && !l.user_id).length
  const authCount = logs.filter((l) => l.event_type === 'login' || (l.event_type === 'page_view' && l.user_id)).length
  const demoCount = logs.filter((l) => l.event_type === 'demo_view').length

  const moduleDistribution = [
    {
      name: 'Mailing & Consultas',
      value: Math.round((mailingCount / totalEvents) * 100),
      color: '#f59e0b',
    },
    {
      name: 'Demos & Auth JWT',
      value: Math.round((authCount / totalEvents) * 100),
      color: '#06b6d4',
    },
    {
      name: 'Interacción Proyectos',
      value: Math.round((demoCount / totalEvents) * 100),
      color: '#a855f7',
    },
  ]

  return {
    totalPageViews,
    totalLogins,
    totalDemoViews,
    dailyTraffic,
    moduleDistribution,
  }
}

function getZeroStats(): TrafficStats {
  const days = ['sáb', 'dom', 'lun', 'mar', 'mié', 'jue', 'vie']
  return {
    totalPageViews: 0,
    totalLogins: 0,
    totalDemoViews: 0,
    dailyTraffic: days.map((date) => ({ date, publicViews: 0, authViews: 0 })),
    moduleDistribution: [
      { name: 'Mailing & Consultas', value: 0, color: '#f59e0b' },
      { name: 'Demos & Auth JWT', value: 0, color: '#06b6d4' },
      { name: 'Interacción Proyectos', value: 0, color: '#a855f7' },
    ],
  }
}