const { supabase } = require('../config/supabase');

/**
 * Modelo de Proyectos (Projects)
 * Gestiona el portafolio de proyectos con soporte para Soft Delete
 */
class ProjectModel {
  /**
   * Obtiene todos los proyectos activos
   */
  static async findAll({ includeDeleted = false } = {}) {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  /**
   * Busca un proyecto por ID
   */
  static async findById(id, { includeDeleted = false } = {}) {
    let query = supabase.from('projects').select('*').eq('id', id);
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  }

  /**
   * Crea un nuevo proyecto en el portfolio
   */
  static async create({ titulo, descripcion, tags_tecnologias = [], image_url = null, demo_url = null, repo_url = null }) {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          titulo,
          descripcion,
          tags_tecnologias,
          image_url,
          demo_url,
          repo_url,
          deleted_at: null,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualiza los datos de un proyecto
   */
  static async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft Delete: Marca el proyecto como borrado sin destruirlo físicamente
   */
  static async softDelete(id) {
    const { data, error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, titulo, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Restaura un proyecto eliminado lógicamente
   */
  static async restore(id) {
    const { data, error } = await supabase
      .from('projects')
      .update({ deleted_at: null })
      .eq('id', id)
      .select('id, titulo, deleted_at')
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = ProjectModel;
