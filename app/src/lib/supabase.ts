import { createClient } from '@supabase/supabase-js'
console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL)

const url ="https://nfjcbrkaerublzfsbwwa.supabase.co"
const anonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mamNicmthZXJ1Ymx6ZnNid3dhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTc0MTk2MiwiZXhwIjoyMTA3MzE3OTYyfQ.x_5aEO4lHcRgdzQhI4J5m2EmcnmIP7MgNAO1pbpVthw"

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
