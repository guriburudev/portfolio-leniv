// Validaciones de formato en el cliente (feedback inmediato).
// La fuente de verdad sigue siendo Supabase Auth en el servidor.

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

export const PASSWORD_MIN = 8
// bcrypt solo procesa los primeros 72 bytes: más allá se ignorarían.
export const PASSWORD_MAX = 72
export const NAME_MIN = 2
export const NAME_MAX = 80

export type FormErrors = Partial<Record<string, string>>

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return 'Ingresá tu correo electrónico.'
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return 'Ingresá un correo electrónico válido.'
  }
  return null
}

export function validateName(value: string): string | null {
  const name = value.trim()
  if (!name) return 'Ingresá tu nombre.'
  if (name.length < NAME_MIN) return `El nombre debe tener al menos ${NAME_MIN} caracteres.`
  if (name.length > NAME_MAX) return `El nombre no puede superar ${NAME_MAX} caracteres.`
  return null
}

export function validateNewPassword(pw: string): string | null {
  if (!pw) return 'Ingresá una contraseña.'
  if (pw.length < PASSWORD_MIN) return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`
  if (new TextEncoder().encode(pw).length > PASSWORD_MAX) {
    return `La contraseña no puede superar ${PASSWORD_MAX} caracteres.`
  }
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) {
    return 'Incluí al menos una mayúscula y una minúscula.'
  }
  if (!/\d/.test(pw)) return 'Incluí al menos un número.'
  return null
}

export interface RegisterValues {
  name: string
  email: string
  password: string
  confirm: string
}

export function validateRegister(values: RegisterValues): FormErrors {
  const errors: FormErrors = {}
  const nameError = validateName(values.name)
  const emailError = validateEmail(values.email)
  const passwordError = validateNewPassword(values.password)
  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  if (!passwordError && values.password !== values.confirm) {
    errors.confirm = 'Las contraseñas no coinciden.'
  }
  return errors
}

// En el login NO se revela la política de contraseñas: solo se exige un email
// con formato válido y que la contraseña no esté vacía.
export function validateLogin(values: { email: string; password: string }): FormErrors {
  const errors: FormErrors = {}
  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError
  if (!values.password) errors.password = 'Ingresá tu contraseña.'
  return errors
}
