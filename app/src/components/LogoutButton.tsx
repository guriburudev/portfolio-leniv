import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Cierra la sesión (destruye el token) y vuelve a la vista pública.
export default function LogoutButton() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Primero se navega, para que el guard de /work/:id no redirija al login.
    navigate('/', { replace: true })
    await signOut()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Cerrar sesión"
      className="inline-flex min-h-10 items-center justify-center rounded-md border border-default bg-surface-hover px-4 py-2 text-xs font-semibold text-text-primary hover:bg-elevated"
    >
      Cerrar sesión
    </button>
  )
}