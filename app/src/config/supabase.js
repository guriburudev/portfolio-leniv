const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env (o .env.example como alternativa)
dotenv.config();
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: '.env.example' });
}

const supabaseUrl = process.env.SUPABASE_URL;
// Se prioriza la service_role key en el backend para operaciones administrativas (ej. bypass RLS / seed)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error de configuración: Faltan variables de entorno para Supabase.');
  console.error('Asegúrate de definir SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY) en tu archivo .env');
}

/**
 * Cliente de conexión a Supabase configurado y protegido por variables de entorno.
 */
const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = {
  supabase,
};
