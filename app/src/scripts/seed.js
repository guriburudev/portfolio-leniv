const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: '.env.example' });
}

/**
 * Script de Seed (Población inicial)
 * Compatible tanto con tablas en inglés (users) como en español (usuarios).
 */
async function runSeed() {
  console.log('🚀 Iniciando script de Seed en Supabase...');

  try {
    // 1. Detectar si la tabla se llama 'users' o 'usuarios'
    let tableName = 'users';
    let emailField = 'email';
    let passField = 'password';
    let deletedField = 'deleted_at';

    const { error: checkUsersErr } = await supabase.from('users').select('id').limit(1);

    if (checkUsersErr && (checkUsersErr.code === '42P01' || checkUsersErr.message?.includes('users'))) {
      const { error: checkUsuariosErr } = await supabase.from('usuarios').select('id').limit(1);
      if (!checkUsuariosErr) {
        tableName = 'usuarios';
        console.log('ℹ️ Detectada tabla con nombre en español: "usuarios"');
        emailField = 'correo electrónico';
        passField = 'contraseña';
        deletedField = 'eliminado_at';
      }
    } else {
      console.log('ℹ️ Detectada tabla con nombre: "users"');
    }

    // 2. Limpieza de usuarios anteriores
    console.log(`🧹 Limpiando tabla "${tableName}"...`);
    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('⚠️ Nota sobre la limpieza:', deleteError.message);
    } else {
      console.log(`✅ Tabla "${tableName}" limpia.`);
    }

    // 3. Preparación de credenciales
    const adminName = process.env.ADMIN_DEFAULT_NAME || 'Administrador Principal';
    const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@portfolio.com').toLowerCase();
    const plainPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin1234!';

    console.log(`🔐 Encriptando contraseña para el usuario administrador (${adminEmail})...`);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // 4. Inserción del usuario Administrador
    console.log(`👤 Insertando usuario Admin por defecto en "${tableName}"...`);
    let payload = {
      nombre: adminName,
      role: 'Admin',
      estado_activo: true,
      [emailField]: adminEmail,
      [passField]: hashedPassword,
      [deletedField]: null,
    };

    let { data: newUser, error: insertError } = await supabase
      .from(tableName)
      .insert([payload])
      .select('*')
      .single();

    // Si falló por nombre de columna alternativo en 'usuarios'
    if (insertError && tableName === 'usuarios') {
      console.log('🔄 Reintentando inserción con columnas alternativas...');
      payload = {
        nombre: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        estado_activo: true,
        deleted_at: null,
      };
      const retry = await supabase.from(tableName).insert([payload]).select('*').single();
      newUser = retry.data;
      insertError = retry.error;
    }

    if (insertError) {
      throw insertError;
    }

    console.log('🎉 Seed completado exitosamente:');
    console.table([
      {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email || newUser['correo electrónico'],
        role: newUser.role,
        estado_activo: newUser.estado_activo,
      },
    ]);
    console.log(`\n📌 Credenciales de prueba:`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`\n✅ Todo listo para que el equipo comience a probar.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la ejecución del Seed:', error);
    process.exit(1);
  }
}

runSeed();
