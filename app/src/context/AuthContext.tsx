import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Role, UserProfile } from '../lib/types'

// Nombre de la tabla pública en Supabase
const USERS_TABLE = 'users'

// Duración máxima de la sesión (24 horas)
export const SESSION_MAX_MS = 24 * 60 * 60 * 1000

export const INVALID_CREDENTIALS = 'Credenciales inválidas'
const ACCOUNT_INACTIVE = 'Esta cuenta se encuentra suspendida o dada de baja.'
const GENERIC_LOGIN_ERROR = 'No pudimos iniciar sesión. Intentá de nuevo en unos minutos.'
const RATE_LIMIT_ERROR = 'Demasiados intentos. Esperá unos minutos antes de volver a probar.'
const GENERIC_REGISTER_ERROR =
  'No pudimos completar el registro. Verificá los datos e intentá de nuevo.'

interface SignUpArgs {
  name: string
  email: string
  password: string
  projectId?: string | null
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  role: Role | null
  isAdmin: boolean
  isOperator: boolean
  isStaff: boolean // true si es admin u operator (para acceso al Dashboard)
  loading: boolean
  signIn: (args: { email: string; password: string }) => Promise<{ error: string | null }>
  signUp: (args: SignUpArgs) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isExpired(session: Session | null): boolean {
  const last = session?.user?.last_sign_in_at
  if (!last) return false
  return Date.now() - new Date(last).getTime() > SESSION_MAX_MS
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [initialized, setInitialized] = useState(false)

  // 1) Sesión actual + suscripción a cambios de Supabase Auth
  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setInitialized(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
      if (!next) setProfile(null)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // 2) Control de expiración periódica (24h)
  useEffect(() => {
    if (!session) return undefined
    const check = () => {
      if (isExpired(session)) void supabase.auth.signOut()
    }
    check()
    const id = window.setInterval(check, 60 * 1000)
    return () => window.clearInterval(id)
  }, [session])

  // Obtención del perfil y rol desde la tabla 'users'
  const userId = session?.user?.id ?? null
  const userEmail = session?.user?.email ?? ''

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      return undefined
    }

    let active = true

    supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return

        if (error || !data) {
          // Fallback seguro a rol base
          setProfile({
            id: userId,
            nombre: (session?.user?.user_metadata?.nombre as string) || userEmail.split('@')[0],
            email: userEmail,
            role: 'user',
            estado_activo: true,
            fecha_registro: new Date().toISOString(),
          })
          return
        }

        // Si la cuenta fue desactivada por un admin, forzar deslogueo
        if (!data.estado_activo || data.deleted_at) {
          void supabase.auth.signOut()
          return
        }

        const rawRole = (data.role || 'user').toString().trim().toLowerCase()
        const normalizedRole: Role = rawRole === 'admin' ? 'admin' : rawRole === 'operator' ? 'operator' : 'user'

        setProfile({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          role: normalizedRole,
          estado_activo: data.estado_activo,
          fecha_registro: data.fecha_registro,
          updated_at: data.updated_at,
          deleted_at: data.deleted_at,
        })
      })

    return () => {
      active = false
    }
  }, [userId, userEmail, session?.user?.user_metadata?.nombre])

  const signIn = useCallback<AuthContextValue['signIn']>(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      if (error.status === 429) return { error: RATE_LIMIT_ERROR }
      if (!error.status || error.status >= 500) return { error: GENERIC_LOGIN_ERROR }
      return { error: INVALID_CREDENTIALS }
    }

    // Verificar si el usuario está activo antes de dejarlo continuar
    if (data.user) {
      const { data: userRow } = await supabase
        .from(USERS_TABLE)
        .select('estado_activo, deleted_at')
        .eq('id', data.user.id)
        .single()

      if (userRow && (!userRow.estado_activo || userRow.deleted_at)) {
        await supabase.auth.signOut()
        return { error: ACCOUNT_INACTIVE }
      }
    }

    return { error: null }
  }, [])

  const signUp = useCallback<AuthContextValue['signUp']>(
    async ({ name, email, password, projectId }) => {
      const redirectTo = `${window.location.origin}/login${
        projectId ? `?project=${encodeURIComponent(projectId)}` : ''
      }`

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nombre: name.trim(), // Se sincroniza con trigger a public.users.nombre
            role: 'user',
          },
          emailRedirectTo: redirectTo,
        },
      })

      if (error) {
        if (error.status === 429) return { error: RATE_LIMIT_ERROR, needsConfirmation: false }
        return { error: GENERIC_REGISTER_ERROR, needsConfirmation: false }
      }

      return { error: null, needsConfirmation: !data.session }
    },
    [],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const profileReady = Boolean(profile) && profile?.id === userId
    const currentRole = profileReady ? (profile?.role ?? null) : null

    return {
      session,
      user: session?.user ?? null,
      profile: profileReady ? profile : null,
      role: currentRole,
      isAdmin: currentRole === 'admin',
      isOperator: currentRole === 'operator',
      isStaff: currentRole === 'admin' || currentRole === 'operator',
      loading: !initialized || (Boolean(session) && !profileReady),
      signIn,
      signUp,
      signOut,
    }
  }, [session, profile, userId, initialized, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
