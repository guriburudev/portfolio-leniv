const { supabase } = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Modelo de Usuario (Users)
 * Gestiona operaciones de persistencia en Supabase con soporte para Soft Delete
 */
class UserModel {
  /**
   * Obtiene todos los usuarios activos (excluye registros soft-deleted)
   */
  static async findAll({ includeDeleted = false } = {}) {
    let query = supabase.from('users').select('id, nombre, email, role, fecha_registro, estado_activo, created_at, updated_at, deleted_at');
    
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Busca un usuario por ID
   */
  static async findById(id, { includeDeleted = false } = {}) {
    let query = supabase.from('users').select('*').eq('id', id);
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  }

  /**
   * Busca un usuario por email (útil para autenticación / login)
   */
  static async findByEmail(email, { includeDeleted = false } = {}) {
    let query = supabase.from('users').select('*').eq('email', email.toLowerCase());
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data;
  }

  /**
   * Crea un nuevo usuario encriptando la contraseña con bcrypt
   */
  static async create({ nombre, email, password, role = 'Admin', estado_activo = true }) {
    // Encriptación de contraseña (salting + hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          nombre,
          email: email.toLowerCase(),
          password: hashedPassword,
          role,
          estado_activo,
          deleted_at: null, // Soft delete nulo por defecto
        },
      ])
      .select('id, nombre, email, role, fecha_registro, estado_activo')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft Delete: Marca el usuario como eliminado asignando la fecha actual en deleted_at
   */
  static async softDelete(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Restaura un usuario previamente marcado como eliminado
   */
  static async restore(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ deleted_at: null })
      .eq('id', id)
      .select('id, email, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = UserModel;
