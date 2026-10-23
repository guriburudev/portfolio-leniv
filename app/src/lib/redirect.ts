import type { Role } from './types'

export const PROJECT_PARAM = 'project'

// Solo se aceptan IDs "simples" (letras, números, guion y guion bajo).
// Nunca una URL: así se evita el "open redirect".
const PROJECT_ID_RE = /^[A-Za-z0-9_-]{1,64}$/

export function sanitizeProjectId(value: string | null | undefined): string | null {
  return value && PROJECT_ID_RE.test(value) ? value : null
}

// Lee el ID del proyecto pendiente desde la URL (?project=<id>).
export function getPendingProjectId(params: URLSearchParams): string | null {
  return sanitizeProjectId(params.get(PROJECT_PARAM))
}

export function getPostLoginPath(args: { role: Role | null; projectId: string | null }): string {
  if (args.role === 'admin' || args.role === 'operator') return '/admin'
  if (args.projectId) return `/work/${args.projectId}`
  return '/'
}

// Arma una URL de login/registro conservando el proyecto pendiente.
export function authPath(base: string, projectId: string | null): string {
  return projectId ? `${base}?${PROJECT_PARAM}=${encodeURIComponent(projectId)}` : base
}