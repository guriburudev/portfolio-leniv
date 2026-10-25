import { createClient } from '@supabase/supabase-js'

// Lee las credenciales públicas de Supabase desde las variables de Vite.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Si faltan las variables del .env, se crea un cliente inerte para que la app
// no se rompa al arrancar; el login simplemente va a fallar.
export const supabase = createClient(
  url || 'http://localhost:54321',
  anonKey || 'missing-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
