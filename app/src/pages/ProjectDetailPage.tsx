import { Link, useParams } from 'react-router-dom'
import { btnSecondary, card } from '../lib/ui'

// PLACEHOLDER: destino del deep link (/work/<id>). Solo se llega con sesión.
// Reemplazar por la vista de detalle real del proyecto cuando exista.
export default function ProjectDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <Link to="/" className={`${btnSecondary} mb-6`}>
        ← Volver al inicio
      </Link>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-text-primary">
        Detalle del proyecto
      </h1>
      <p className="mb-6 font-mono text-sm text-accent">id: {id}</p>
      <div className={`${card} flex h-64 items-center justify-center text-text-tertiary`}>
        <p className="font-mono text-xs">Acá va la demo interactiva del proyecto</p>
      </div>
    </section>
  )
}
