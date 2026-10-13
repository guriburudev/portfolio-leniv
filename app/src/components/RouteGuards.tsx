import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authPath, getPendingProjectId, getPostLoginPath, sanitizeProjectId } from '../lib/redirect'
import Spinner from './Spinner'

// Solo usuarios autenticados. Si la ruta es /work/<id>, el ID se conserva en
// el login como deep link (/login?project=<id>).
export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner />
  if (!session) {
    const match = location.pathname.match(/^\/work\/([^/]+)/)
    const projectId = sanitizeProjectId(match ? decodeURIComponent(match[1]) : null)
    return <Navigate to={authPath('/login', projectId)} replace />
  }
  return <Outlet />
}

// Solo administradores. Un usuario común vuelve al inicio; un visitante, al login.
export function RequireAdmin() {
  const { session, isAdmin, loading } = useAuth()

  if (loading) return <Spinner />
  if (!session) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}

// Login y registro: si ya hay sesión, redirige según rol / proyecto pendiente.
// Este es el único punto donde ocurre la redirección posterior al login.
export function GuestOnly() {
  const { session, role, loading } = useAuth()
  const [searchParams] = useSearchParams()

  if (loading) return <Spinner />
  if (session) {
    const projectId = getPendingProjectId(searchParams)
    return <Navigate to={getPostLoginPath({ role, projectId })} replace />
  }
  return <Outlet />
}
