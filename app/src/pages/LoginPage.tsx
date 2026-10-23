import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { validateLogin } from '../lib/validation'
import type { FormErrors } from '../lib/validation'
import { authPath, getPendingProjectId } from '../lib/redirect'
import { btnLarge, btnPrimary, card } from '../lib/ui'

export default function LoginPage() {

  const { signIn, role } = useAuth()
  const [searchParams] = useSearchParams()
  const projectId = getPendingProjectId(searchParams)

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    const found = validateLogin(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { error } = await signIn(values)

    if (error) {
      setFormError(error)
      setSubmitting(false)
      setValues((v) => ({ ...v, password: '' }))
      return
    }
  }
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-text-primary">
        Iniciar sesión
      </h1>
      <p className="mb-6 text-text-secondary">
        {projectId
          ? 'Iniciá sesión para ver la demo del proyecto.'
          : 'Accedé a las demos y al panel según tus permisos.'}
      </p>

      <form onSubmit={onSubmit} noValidate className={`${card} space-y-4 p-6`}>
        {formError && (
          <div
            role="alert"
            className="rounded-md border border-red-500 px-4 py-3 text-[13px] font-medium text-red-500"
          >
            {formError}
          </div>
        )}

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@email.com"
          value={values.email}
          onChange={onChange}
          error={errors.email}
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          value={values.password}
          onChange={onChange}
          error={errors.password}
        />

        <button type="submit" className={`${btnPrimary} ${btnLarge}`} disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Ingresar →'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px]">
        ¿No tenés cuenta?{' '}
        <Link
          to={authPath('/register', projectId)}
          className="font-semibold text-accent hover:underline"
        >
          Registrate
        </Link>
      </p>
    </div>
  )
}
