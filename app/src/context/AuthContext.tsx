import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Role } from '../lib/types'

// ⚠️ Ajustar si la tabla de roles de tu compañero se llama distinto.
// Se espera una tabla con: id (uuid del usuario), role ('user' | 'admin')
// y, opcionalmente, email y full_name.
const PROFILES_TABLE = 'profiles'

// Duración máxima de una sesión desde el último inicio de sesión con contraseña.
export const SESSION_MAX_MS = 24 * 60 * 60 * 1000

export const INVALID_CREDENTIALS = 'Credenciales inválidas'
const GENERIC_LOGIN_ERROR = 'No pudimos iniciar sesión. Intentá de nuevo en unos minutos.'
const RATE_LIMIT_ERROR = 'Demasiados intentos. Esperá unos minutos antes de volver a probar.'
const GENERIC_REGISTER_ERROR =
  'No pudimos completar el registro. Verificá los datos e intentá de nuevo.'

export interface Profile {
  id: string
  email: string | null
  fullName: string | null
  role: Role
}

interface SignUpArgs {
  name: string
  email: string
  password: string
  projectId: string | null
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  role: Role | null
  isAdmin: boolean
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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [initialized, setInitialized] = useState(false)

  // 1) Sesión actual + suscripción a cambios (login, logout, refresh de token)
  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setInitialized(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      // No hacer llamadas a supabase dentro de este callback (puede bloquearse).
      setSession(next ?? null)
      if (!next) setProfile(null)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // 2) Expiración de 24 h: se verifica al cargar y cada minuto.
  useEffect(() => {
    if (!session) return undefined
    const check = () => {
      if (isExpired(session)) void supabase.auth.signOut()
    }
    check()
    const id = window.setInterval(check, 60 * 1000)
    return () => window.clearInterval(id)
  }, [session])

  // 3) Perfil (rol) del usuario autenticado.
  const userId = session?.user?.id ?? null
  const userEmail = session?.user?.email ?? null
  const metaName = (session?.user?.user_metadata?.full_name as string | undefined) ?? null

  useEffect(() => {
    if (!userId) return undefined
    let active = true

    supabase
      .from(PROFILES_TABLE)
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return
        // Si la lectura falla o no hay fila, se cae al rol de menor privilegio.
        const row = (data ?? {}) as Record<string, unknown>
        setProfile({
          id: userId,
          email: (row.email as string | undefined) ?? userEmail,
          fullName: (row.full_name as string | undefined) ?? metaName,
          role: row.role === 'admin' ? 'admin' : 'user',
        })
      })

    return () => {
      active = false
    }
  }, [userId, userEmail, metaName])

  const signIn = useCallback<AuthContextValue['signIn']>(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (!error) return { error: null }

    if (error.status === 429) return { error: RATE_LIMIT_ERROR }
    if (!error.status || error.status >= 500) return { error: GENERIC_LOGIN_ERROR }
    // Contraseña incorrecta, correo inexistente o correo sin confirmar:
    // siempre el mismo mensaje, para no permitir enumeración de usuarios.
    return { error: INVALID_CREDENTIALS }
  }, [])

  const signUp = useCallback<AuthContextValue['signUp']>(
    async ({ name, email, password, projectId }) => {
      const redirectTo = `${window.location.origin}/login${
        projectId ? `?project=${encodeURIComponent(projectId)}` : ''
      }`
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() }, emailRedirectTo: redirectTo },
      })
      if (error) {
        if (error.status === 429) return { error: RATE_LIMIT_ERROR, needsConfirmation: false }
        return { error: GENERIC_REGISTER_ERROR, needsConfirmation: false }
      }
      // Con confirmación de correo activa, un email ya registrado devuelve un
      // usuario "ofuscado" y NO un error: se muestra el mismo mensaje que en un
      // registro nuevo para no revelar si la cuenta existe.
      return { error: null, needsConfirmation: !data.session }
    },
    [],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const profileReady = Boolean(profile) && profile?.id === userId
    return {
      session,
      user: session?.user ?? null,
      profile: profileReady ? profile : null,
      role: profileReady ? (profile?.role ?? null) : null,
      isAdmin: profileReady && profile?.role === 'admin',
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
