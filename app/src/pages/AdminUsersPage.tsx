import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AdminUser } from '../lib/types'
import { listUsers, setUserStatus, type UserAction } from '../services/adminUserService'

type SortKey = 'nombre' | 'email' | 'fecha_registro' | 'estado_activo'
type StatusFilter = 'all' | 'active' | 'blocked'

const inputClass = 'rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

// Mensajes de confirmación y de éxito para cada acción del administrador.
const confirmText: Record<UserAction, (user: AdminUser) => string> = {
  block: (u) => `¿Bloquear la cuenta de ${u.email}? Se cerrará su sesión y no podrá volver a ingresar.`,
  unblock: (u) => `¿Desbloquear la cuenta de ${u.email}?`,
  delete: (u) => `¿Eliminar la cuenta de ${u.email}? Dejará de aparecer en este panel y no podrá ingresar.`,
}
const doneText: Record<UserAction, string> = {
  block: 'Cuenta bloqueada. Su sesión fue invalidada.',
  unblock: 'Cuenta desbloqueada.',
  delete: 'Cuenta eliminada.',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })

// Panel de gestión de usuarios registrados (HU08).
export default function AdminUsersPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('fecha_registro')
  const [sortAsc, setSortAsc] = useState(false)

  // Pide el listado al backend (admin_list_users); solo trae usuarios estándar.
  const refresh = useCallback(async () => {
    setLoading(true)
    try { setUsers(await listUsers()); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los usuarios.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  // Filtra por texto y estado, y ordena según la columna elegida.
  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = users.filter((user) => {
      if (statusFilter === 'active' && !user.estado_activo) return false
      if (statusFilter === 'blocked' && user.estado_activo) return false
      return !term || user.nombre.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    })
    const direction = sortAsc ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortKey === 'estado_activo') return (Number(a.estado_activo) - Number(b.estado_activo)) * direction
      return String(a[sortKey]).localeCompare(String(b[sortKey]), 'es', { sensitivity: 'base' }) * direction
    })
  }, [users, search, statusFilter, sortKey, sortAsc])

  // Click en un encabezado: cambia la columna o invierte el orden.
  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((current) => !current)
    else { setSortKey(key); setSortAsc(true) }
  }

  // Pide confirmación, ejecuta la acción y recarga la tabla.
  const runAction = async (user: AdminUser, action: UserAction) => {
    if (!window.confirm(confirmText[action](user))) return
    setError(''); setNotice(''); setBusyId(user.id)
    try { await setUserStatus(user.id, action); setNotice(doneText[action]); await refresh() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo actualizar la cuenta.') }
    finally { setBusyId(null) }
  }

  const activeCount = users.filter((user) => user.estado_activo).length
  const sortMark = (key: SortKey) => (key === sortKey ? (sortAsc ? ' ▲' : ' ▼') : '')
  const headerButton = 'inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary'

  return (
    <div className="min-h-screen bg-canvas px-4 py-8 text-text-primary sm:px-6">
      <main className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-overlay p-5 shadow-lg backdrop-blur-xl sm:p-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Administración · HU08</p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Usuarios registrados</h1>
            <p className="mt-2 text-sm text-text-secondary">Cuentas creadas para acceder a las demostraciones del portfolio.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-text-tertiary sm:inline">{profile?.email}</span>
            <Link className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:border-accent" to="/admin">Volver al panel</Link>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface/90 shadow-lg backdrop-blur-xl" aria-labelledby="users-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle p-5 sm:p-6">
            <div>
              <h2 className="font-display text-xl font-bold" id="users-title">Cuentas de usuario</h2>
              <p className="mt-1 text-xs text-text-tertiary">{users.length} en total · {activeCount} activas · {users.length - activeCount} bloqueadas</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input aria-label="Buscar por nombre o email" className={`${inputClass} w-56`} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nombre o email…" type="search" value={search} />
              <select aria-label="Filtrar por estado" className={inputClass} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} value={statusFilter}>
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="blocked">Bloqueados</option>
              </select>
              <button className="rounded-lg border border-border px-3 py-2 text-xs hover:border-accent disabled:opacity-50" disabled={loading} onClick={() => void refresh()} type="button">Actualizar</button>
            </div>
          </div>

          {error && <p className="m-5 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error" role="alert">{error}</p>}
          {notice && <p className="m-5 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success" role="status">{notice}</p>}

          {loading ? (
            <p className="p-6 text-sm text-text-secondary" role="status">Cargando usuarios…</p>
          ) : visibleUsers.length === 0 ? (
            <p className="p-6 text-sm text-text-secondary">{users.length === 0 ? 'Todavía no hay usuarios registrados.' : 'Ningún usuario coincide con el filtro.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border-subtle bg-elevated/60">
                  <tr>
                    <th className="px-5 py-3" scope="col"><button className={headerButton} onClick={() => toggleSort('nombre')} type="button">Nombre{sortMark('nombre')}</button></th>
                    <th className="px-5 py-3" scope="col"><button className={headerButton} onClick={() => toggleSort('email')} type="button">Email{sortMark('email')}</button></th>
                    <th className="px-5 py-3" scope="col"><button className={headerButton} onClick={() => toggleSort('fecha_registro')} type="button">Fecha de registro{sortMark('fecha_registro')}</button></th>
                    <th className="px-5 py-3" scope="col"><button className={headerButton} onClick={() => toggleSort('estado_activo')} type="button">Estado{sortMark('estado_activo')}</button></th>
                    <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-text-secondary" scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {visibleUsers.map((user) => (
                    <tr className="hover:bg-surface-hover" key={user.id}>
                      <td className="px-5 py-3 font-medium">{user.nombre}</td>
                      <td className="px-5 py-3 text-text-secondary">{user.email}</td>
                      <td className="px-5 py-3 text-text-secondary">{formatDate(user.fecha_registro)}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${user.estado_activo ? 'border-success/30 bg-success/10 text-success' : 'border-error/30 bg-error/10 text-error'}`}>
                          {user.estado_activo ? 'Activa' : 'Bloqueada'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-md border border-border px-3 py-1.5 text-xs hover:border-accent disabled:opacity-50" disabled={busyId === user.id} onClick={() => void runAction(user, user.estado_activo ? 'block' : 'unblock')} type="button">
                            {user.estado_activo ? 'Bloquear' : 'Desbloquear'}
                          </button>
                          <button className="rounded-md border border-error/30 px-3 py-1.5 text-xs text-error hover:bg-error/10 disabled:opacity-50" disabled={busyId === user.id} onClick={() => void runAction(user, 'delete')} type="button">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}