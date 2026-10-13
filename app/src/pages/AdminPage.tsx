import { useAuth } from '../context/AuthContext'
import { card } from '../lib/ui'

// PLACEHOLDER: ruta privada /admin (protegida por RequireAdmin).
// Reemplazar por el dashboard administrativo real.
export default function AdminPage() {
  const { profile } = useAuth()

  return (
    <section>
      <span className="mb-3 inline-flex rounded-full bg-accent-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
        Admin
      </span>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-text-primary">
        Dashboard administrativo
      </h1>
      <p className="mb-6 text-text-secondary">
        Sesión de administrador:{' '}
        <span className="font-mono text-text-primary">{profile?.email}</span>
      </p>
      <div className={`${card} p-6 text-text-tertiary`}>En construcción.</div>
    </section>
  )
}
