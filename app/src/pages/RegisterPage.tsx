import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Field from '../components/Field'
import { useAuth } from '../context/AuthContext'
import { PASSWORD_MIN, validateRegister } from '../lib/validation'
import type { FormErrors } from '../lib/validation'
import { authPath, getPendingProjectId } from '../lib/redirect'
import { btnLarge, btnPrimary, card } from '../lib/ui'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [searchParams] = useSearchParams()
  const projectId = getPendingProjectId(searchParams)

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    const found = validateRegister(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const { error, needsConfirmation } = await signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      projectId,
    })
    setSubmitting(false)
    if (error) {
      setFormError(error)
      return
    }
    // Sin confirmación de correo hay sesión inmediata y GuestOnly redirige.
    if (needsConfirmation) setConfirmationSent(true)
  }

  if (confirmationSent) {
    return (
      <div className="mx-auto max-w-md">
        <div className={`${card} p-6 text-center`} role="status">
          <div className="mb-3 text-3xl" aria-hidden="true">
            ✉️
          </div>
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-text-primary">
            Revisá tu correo
          </h1>
          <p className="mb-5 text-text-secondary">
            Si los datos son válidos, te enviamos un mensaje para confirmar tu cuenta. Una vez
            confirmada, podés iniciar sesión.
          </p>
          <Link to={authPath('/login', projectId)} className={btnPrimary}>
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-text-primary">
        Crear cuenta
      </h1>
      <p className="mb-6 text-text-secondary">
        {projectId
          ? 'Registrate para ver la demo del proyecto.'
          : 'Registrate para acceder a las demos interactivas.'}
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
          label="Nombre completo"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre..."
          value={values.name}
          onChange={onChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder={`Mínimo ${PASSWORD_MIN} caracteres`}
          hint={`Mínimo ${PASSWORD_MIN} caracteres, con mayúscula, minúscula y número.`}
          value={values.password}
          onChange={onChange}
          error={errors.password}
        />
        <Field
          label="Repetir contraseña"
          name="confirm"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={onChange}
          error={errors.confirm}
        />

        <button type="submit" className={`${btnPrimary} ${btnLarge}`} disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta →'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px]">
        ¿Ya tenés cuenta?{' '}
        <Link
          to={authPath('/login', projectId)}
          className="font-semibold text-accent hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
