import { supabase } from '../lib/supabase'

export interface OverviewKPIs {
  newMessages: number
  urgentMessages: number
  todayMessages: number
  activeUsers: number
  publishedProjects: number
  dbStatus: 'online' | 'degraded' | 'offline'
  latencyMs: number
}

export interface TrafficStats {
  totalPageViews: number
  totalLogins: number
  totalDemoViews: number
  dailyTraffic: { date: string; publicViews: number; authViews: number }[]
  moduleDistribution: { name: string; value: number; color: string }[]
}

export async function getOverviewKPIs(): Promise<OverviewKPIs> {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startTime = performance.now()

  try {
    const [messagesRes, usersRes, projectsRes] = await Promise.all([
      supabase.from('messages').select('*', { count: 'exact' }),

      supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('estado_activo', true),

      supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('is_private', false),
    ])

    const latencyMs = Math.round(performance.now() - startTime)

    const rawMessages = messagesRes.data || []
    
    const unreadMessages = rawMessages.filter(
      (m) => m.status === 'unread' || m.estado === 'unread' || m.estado === 'pendiente'
    )

    const newMessages = unreadMessages.length

    // Mensajes urgentes
    const urgentMessages = unreadMessages.filter(
      (m) => m.es_urgente === true || m.is_urgent === true || m.prioridad === 'alta'
    ).length

    // Mensajes de hoy
    const todayMessages = unreadMessages.filter((m) => {
      const msgDate = new Date(m.created_at || m.fecha || m.fecha_creacion)
      return msgDate >= startOfToday
    }).length

    const activeUsers = usersRes.count ?? usersRes.data?.length ?? 0
    const publishedProjects = projectsRes.count ?? projectsRes.data?.length ?? 0

    const isHealthy = !messagesRes.error && !usersRes.error && !projectsRes.error

    return {
      newMessages,
      urgentMessages,
      todayMessages,
      activeUsers,
      publishedProjects,
      dbStatus: isHealthy ? 'online' : 'degraded',
      latencyMs,
    }
  } catch (error) {
    console.error('Error al obtener KPIs:', error)
    return {
      newMessages: 0,
      urgentMessages: 0,
      todayMessages: 0,
      activeUsers: 0,
      publishedProjects: 0,
      dbStatus: 'offline',
      latencyMs: 0,
    }
  }
}

export async function getDashboardMetrics(days: number = 7): Promise<TrafficStats> {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const { data: logs, error } = await supabase
    .from('traffic_logs')
    .select('event_type, user_id, created_at')
    .gte('created_at', fromDate.toISOString())

  if (error || !logs || logs.length === 0) {
    return getZeroStats(days)
  }

  const totalPageViews = logs.filter((l) => l.event_type === 'page_view').length
  const totalLogins = logs.filter((l) => l.event_type === 'login').length
  const totalDemoViews = logs.filter((l) => l.event_type === 'demo_view').length

  const daysMap: Record<string, { publicViews: number; authViews: number }> = {}

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('es-AR', {
      weekday: days <= 14 ? 'short' : undefined,
      day: 'numeric',
      month: days > 14 ? 'numeric' : undefined,
    }).replace('.', '')
    
    daysMap[key] = { publicViews: 0, authViews: 0 }
  }

  logs.forEach((log) => {
    const d = new Date(log.created_at)
    const key = d.toLocaleDateString('es-AR', {
      weekday: days <= 14 ? 'short' : undefined,
      day: 'numeric',
      month: days > 14 ? 'numeric' : undefined,
    }).replace('.', '')

    if (daysMap[key]) {
      if (log.event_type === 'login' || log.user_id) {
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

  // 3. Distribución por módulos (HU12)
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

function getZeroStats(days: number): TrafficStats {
  const dummyDays = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric' })
  })

  return {
    totalPageViews: 0,
    totalLogins: 0,
    totalDemoViews: 0,
    dailyTraffic: dummyDays.map((date) => ({ date, publicViews: 0, authViews: 0 })),
    moduleDistribution: [
      { name: 'Mailing & Consultas', value: 0, color: '#f59e0b' },
      { name: 'Demos & Auth JWT', value: 0, color: '#06b6d4' },
      { name: 'Interacción Proyectos', value: 0, color: '#a855f7' },
    ],
  }
}