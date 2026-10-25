import { supabase } from '../lib/supabase'

const PROJECTS_TABLE = 'active_projects'

// Forma estable de proyecto que comparten el editor y el catálogo público.
export interface ProjectRecord {
  id: string
  title: string
  description: string
  technologies: string[]
  repoUrl: string
  demoUrl: string
  imageUrl: string | null
}

export type ProjectInput = Omit<ProjectRecord, 'id' | 'imageUrl'>
type ProjectRow = Record<string, unknown>

// Adapta las columnas de Supabase al formato que utiliza la interfaz React.
function toProject(row: ProjectRow): ProjectRecord {
  const technologies = row.tags_tecnologias ?? row.technologies
  return {
    id: String(row.id),
    title: String(row.titulo ?? row.title ?? ''),
    description: String(row.descripcion ?? row.description ?? ''),
    technologies: Array.isArray(technologies) ? technologies.map(String) : [],
    repoUrl: String(row.repo_url ?? row.repoUrl ?? ''),
    demoUrl: String(row.demo_url ?? row.demoUrl ?? ''),
    imageUrl: (row.image_url as string | null) ?? null,
  }
}

// Convierte los campos del formulario a los nombres de columnas del proyecto.
function toDatabaseProject(project: ProjectInput) {
  return {
    titulo: project.title.trim(),
    descripcion: project.description.trim(),
    tags_tecnologias: project.technologies.map((tag) => tag.trim()).filter(Boolean),
    repo_url: project.repoUrl.trim(),
    demo_url: project.demoUrl.trim(),
  }
}

// Lee los proyectos vigentes; el permiso público se controla mediante RLS.
export async function listProjects(): Promise<ProjectRecord[]> {
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw new Error('No se pudieron cargar los proyectos.')
  return (data ?? []).map((row) => toProject(row as ProjectRow))
}

// Inserta un proyecto con la sesión actual; Supabase valida la política RLS.
export async function createProject(project: ProjectInput): Promise<ProjectRecord> {
  const { data, error } = await supabase.from(PROJECTS_TABLE).insert(toDatabaseProject(project)).select('*').single()
  if (error) throw new Error(error.code === '42501' ? 'No tenés permisos para crear proyectos.' : 'No se pudo crear el proyecto.')
  return toProject(data as ProjectRow)
}

// Actualiza el proyecto seleccionado y devuelve la fila persistida.
export async function updateProject(id: string, project: ProjectInput): Promise<ProjectRecord> {
  const { data, error } = await supabase.from(PROJECTS_TABLE).update(toDatabaseProject(project)).eq('id', id).is('deleted_at', null).select('*').maybeSingle()
  if (error) throw new Error(error.code === '42501' ? 'No tenés permisos para editar proyectos.' : 'No se pudo actualizar el proyecto.')
  if (!data) throw new Error('No se encontró el proyecto o no tenés permisos para editarlo.')
  return toProject(data as ProjectRow)
}

// Elimina el proyecto elegido; la política DELETE de Supabase debe validar el rol admin.
export async function deleteProject(id: string): Promise<void> {
  const { data, error } = await supabase.from(PROJECTS_TABLE).delete().eq('id', id).select('id').maybeSingle()
  if (error) throw new Error(error.code === '42501' ? 'No tenés permisos para eliminar proyectos.' : 'No se pudo eliminar el proyecto.')
  if (!data) throw new Error('No se encontró el proyecto o no tenés permisos para eliminarlo.')
}
