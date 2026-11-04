import { supabase } from '../lib/supabase'
import type { AdminUser } from '../lib/types'
 
// 'block' y 'unblock' cambian el estado de la cuenta; 'delete' es un soft-delete.
export type UserAction = 'block' | 'unblock' | 'delete'
 
const FORBIDDEN = '42501' // código de Postgres para "permiso denegado"
 
// Equivale a GET /api/admin/users: solo devuelve usuarios con rol estándar.
// El permiso se valida en la base (función admin_list_users), no en el front.
export async function listUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.rpc('admin_list_users')
  if (error) {
    throw new Error(error.code === FORBIDDEN ? 'No tenés permisos para ver los usuarios.' : 'No se pudieron cargar los usuarios.')
  }
  return (data ?? []) as AdminUser[]
}
 
// Bloquea, desbloquea o elimina (soft-delete) una cuenta. Al bloquear/eliminar,
// la base también revoca las sesiones y banea al usuario en Supabase Auth.
export async function setUserStatus(userId: string, action: UserAction): Promise<void> {
  const { error } = await supabase.rpc('admin_set_user_status', { p_user_id: userId, p_action: action })
  if (error) {
    throw new Error(error.code === FORBIDDEN ? 'No tenés permisos para modificar esta cuenta.' : 'No se pudo actualizar la cuenta.')
  }
}