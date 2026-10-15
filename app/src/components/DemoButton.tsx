import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { authPath } from '../lib/redirect'
import { btnPrimary } from '../lib/ui'

interface DemoButtonProps {
  projectId: string
  className?: string
  ariaLabel?: string
  children?: ReactNode
}

// Botón "Demo en vivo".
//  - Sin sesión: va al login guardando el ID del proyecto (?project=<id>).
//  - Con sesión: va directo al detalle del proyecto (/work/<id>).
export default function DemoButton({
  projectId,
  className = btnPrimary,
  ariaLabel,
  children = 'Demo en vivo →',
}: DemoButtonProps) {
  const { session } = useAuth()
  const to = session ? `/work/${projectId}` : authPath('/login', projectId)

  return (
    <Link to={to} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}