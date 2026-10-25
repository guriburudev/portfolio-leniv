import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createProject, deleteProject, listProjects, updateProject, type ProjectInput, type ProjectRecord } from '../services/projectService'

// Exige HTTPS y un dominio completo antes de enviar los datos a Supabase.
const secureUrl = /^https:\/\/[\w.-]+(?:\.[\w.-]+)+(?:[/:?#][^\s]*)?$/i
const emptyForm: ProjectInput = { title: '', description: '', technologies: [], repoUrl: '', demoUrl: '' }
const inputClass = 'w-full rounded-lg border border-default bg-canvas px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

// Administra los proyectos con el sistema visual y los tokens de la aplicación.
export default function AdminProjectsPage() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [form, setForm] = useState<ProjectInput>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Mantiene el listado sincronizado con las consultas directas a Supabase.
  const refresh = useCallback(async () => {
    setLoading(true)
    try { setProjects(await listProjects()); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los proyectos.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  // Valida los campos requeridos antes de escribir en la base de datos.
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(''); setNotice('')
    const normalized = { ...form, technologies: form.technologies.map((tag) => tag.trim()).filter(Boolean) }
    if (!normalized.title.trim() || !normalized.description.trim() || !normalized.technologies.length || !normalized.repoUrl.trim() || !normalized.demoUrl.trim()) {
      setError('Completá todos los campos obligatorios y agregá al menos una tecnología.'); return
    }
    if (!secureUrl.test(normalized.repoUrl) || !secureUrl.test(normalized.demoUrl)) {
      setError('Las URL del repositorio y la demo deben ser HTTPS válidas.'); return
    }
    setSaving(true)
    try {
      if (editingId) { await updateProject(editingId, normalized); setNotice('Proyecto actualizado correctamente.') }
      else { await createProject(normalized); setNotice('Proyecto creado correctamente.') }
      setForm(emptyForm); setEditingId(null); await refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo guardar el proyecto.') }
    finally { setSaving(false) }
  }

  // Carga en el formulario los datos del proyecto seleccionado.
  const edit = (project: ProjectRecord) => {
    setEditingId(project.id)
    setForm({ title: project.title, description: project.description, technologies: project.technologies, repoUrl: project.repoUrl, demoUrl: project.demoUrl })
    setNotice('')
  }

  // Solicita confirmación antes de eliminar de forma permanente.
  const remove = async (project: ProjectRecord) => {
    if (!window.confirm(`¿Eliminar el proyecto «${project.title}»? Esta acción no se puede deshacer.`)) return
    setError(''); setNotice('')
    try {
      await deleteProject(project.id)
      if (editingId === project.id) { setEditingId(null); setForm(emptyForm) }
      setNotice('Proyecto eliminado.'); await refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo eliminar el proyecto.') }
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-8 text-text-primary sm:px-6">
      <main className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-default bg-overlay p-5 shadow-lg backdrop-blur-xl sm:p-7">
          <div><p className="font-mono text-xs uppercase tracking-widest text-accent">Administración · CRUD</p><h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Gestión de proyectos</h1><p className="mt-2 text-sm text-text-secondary">Creá, editá y publicá el catálogo de proyectos del portfolio.</p></div>
          <div className="flex items-center gap-3"><span className="hidden text-xs text-text-tertiary sm:inline">{profile?.email}</span><Link className="rounded-lg border border-default bg-surface px-4 py-2 text-sm font-medium hover:border-accent" to="/admin">Volver al panel</Link></div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <form className="h-fit space-y-4 rounded-2xl border border-default bg-surface/90 p-5 shadow-lg backdrop-blur-xl sm:p-6" onSubmit={submit}>
            <div><h2 className="font-display text-xl font-bold">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h2><p className="mt-1 text-xs text-text-tertiary">Todos los campos son obligatorios.</p></div>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">Título<input className={inputClass} maxLength={120} required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">Descripción<textarea className={`${inputClass} min-h-28 resize-y`} maxLength={2000} required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">Tecnologías / Tags <span className="font-normal text-text-tertiary">(separadas por coma)</span><input className={inputClass} required value={form.technologies.join(', ')} onChange={(event) => setForm({ ...form, technologies: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} /></label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">URL del repositorio GitHub<input className={inputClass} type="url" required pattern="https://.*" placeholder="https://github.com/usuario/proyecto" value={form.repoUrl} onChange={(event) => setForm({ ...form, repoUrl: event.target.value })} /></label>
            <label className="block space-y-1.5 text-xs font-medium text-text-secondary">URL de la demo en vivo<input className={inputClass} type="url" required pattern="https://.*" placeholder="https://proyecto.example.com" value={form.demoUrl} onChange={(event) => setForm({ ...form, demoUrl: event.target.value })} /></label>
            {error && <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error" role="alert">{error}</p>}
            {notice && <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success" role="status">{notice}</p>}
            <div className="flex gap-3"><button className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-on-accent hover:bg-accent-hover disabled:opacity-50" disabled={saving} type="submit">{saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear proyecto'}</button>{editingId && <button className="rounded-lg border border-default px-4 py-2.5 text-sm hover:bg-surface-hover" onClick={() => { setEditingId(null); setForm(emptyForm) }} type="button">Cancelar</button>}</div>
          </form>

          <section className="overflow-hidden rounded-2xl border border-default bg-surface/90 shadow-lg backdrop-blur-xl" aria-labelledby="project-list-title">
            <div className="flex items-center justify-between border-b border-subtle p-5 sm:p-6"><div><h2 className="font-display text-xl font-bold" id="project-list-title">Proyectos existentes</h2><p className="mt-1 text-xs text-text-tertiary">{projects.length} publicados</p></div><button className="rounded-lg border border-default px-3 py-2 text-xs hover:border-accent" onClick={() => void refresh()} type="button">Actualizar</button></div>
            {loading ? <p className="p-6 text-sm text-text-secondary" role="status">Cargando proyectos…</p> : projects.length === 0 ? <p className="p-6 text-sm text-text-secondary">Todavía no hay proyectos registrados.</p> : <ul className="divide-y divide-subtle">{projects.map((project) => <li className="flex flex-wrap items-center justify-between gap-4 p-5" key={project.id}><div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{project.title}</h3><p className="mt-1 line-clamp-2 text-xs text-text-secondary">{project.description}</p><div className="mt-2 flex flex-wrap gap-1.5">{project.technologies.map((tag) => <span className="rounded border border-subtle bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-tertiary" key={tag}>{tag}</span>)}</div></div><div className="flex shrink-0 gap-2"><button className="rounded-md border border-default px-3 py-1.5 text-xs hover:border-accent" onClick={() => edit(project)} type="button">Editar</button><button className="rounded-md border border-error/30 px-3 py-1.5 text-xs text-error hover:bg-error/10" onClick={() => void remove(project)} type="button">Eliminar</button></div></li>)}</ul>}
          </section>
        </section>
      </main>
    </div>
  )
}
