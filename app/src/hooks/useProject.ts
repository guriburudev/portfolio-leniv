import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const PROJECTS_TABLE = 'active_projects'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface ProjectDetail {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
}

// Acepta columnas en español (titulo, descripcion, tags_tecnologias) o en inglés.
function toProject(row: Record<string, unknown>): ProjectDetail {
  const tags = row.tags_tecnologias ?? row.technologies
  return {
    id: String(row.id),
    title: String(row.titulo ?? row.title ?? ''),
    description: String(row.descripcion ?? row.description ?? ''),
    technologies: Array.isArray(tags) ? (tags as string[]) : [],
    imageUrl: (row.image_url as string | null) ?? null,
    demoUrl: (row.demo_url as string | null) ?? null,
    repoUrl: (row.repo_url as string | null) ?? null,
  }
}

// MOCK TEMPORAL PARA PRUEBAS DE MAQUETADO (HU05)
// Para probar localmente: http://localhost:5173/work/8a96b2ea-13f0-4fee-b71a-957aa66acdcc
// Para volver al comportamiento estricto con la base de datos, cambia este valor a false.
const ENABLE_MOCK_FALLBACK = true

const MOCK_PROJECT: ProjectDetail = {
  id: '8a96b2ea-13f0-4fee-b71a-957aa66acdcc',
  title: 'proyecto portfolio2026',
  description: 'Plataforma fullstack interactiva desarrollada con React 19, Tailwind CSS y Supabase. Incluye visualización privada de demos en vivo y arquitectura modular.',
  technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Open-Meteo API', 'JWT'],
  imageUrl: null,
  demoUrl: null,
  repoUrl: 'https://github.com/guriburudev/portfolio-leniv',
}

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setProject(null)
    setError(null)

    if (!id || !UUID_RE.test(id)) {
      setError('Este proyecto no existe o fue eliminado.')
      setLoading(false)
      return undefined
    }

    setLoading(true)
    supabase
      .from(PROJECTS_TABLE)
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle()
      .then(({ data, error: dbError }) => {
        if (!active) return

        if (data) {
          setProject(toProject(data as Record<string, unknown>))
        } else if (ENABLE_MOCK_FALLBACK) {
          // Si Supabase devuelve null (bloqueo por RLS o proyecto inexistente), usamos el mock para pruebas de UI
          setProject({ ...MOCK_PROJECT, id })
        } else if (dbError) {
          setError('No pudimos cargar el proyecto. Intentá de nuevo en unos minutos.')
        } else {
          setError('Este proyecto no existe o fue eliminado.')
        }

        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  return { project, loading, error }
}