const { supabase } = require('../config/supabase');

/**
 * Modelo de Mensajes (Messages)
 * Gestiona los mensajes del formulario de contacto recibidos por el portfolio
 */
class MessageModel {
  /**
   * Obtiene todos los mensajes activos
   */
  static async findAll({ includeDeleted = false, status = null } = {}) {
    let query = supabase.from('messages').select('*').order('fecha_envio', { ascending: false });
    
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Busca un mensaje por ID
   */
  static async findById(id, { includeDeleted = false } = {}) {
    let query = supabase.from('messages').select('*').eq('id', id);
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  }

  /**
   * Inserta un nuevo mensaje enviado desde el portfolio
   */
  static async create({ sender_name, sender_email, subject, body }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_name,
          sender_email,
          subject,
          body,
          status: 'unread',
          deleted_at: null,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualiza el estado del mensaje (ej: 'read', 'archived')
   */
  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft Delete: Borrado lógico del mensaje
   */
  static async softDelete(id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, sender_name, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Restaura un mensaje eliminado lógicamente
   */
  static async restore(id) {
    const { data, error } = await supabase
      .from('messages')
      .update({ deleted_at: null })
      .eq('id', id)
      .select('id, sender_name, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = MessageModel;
