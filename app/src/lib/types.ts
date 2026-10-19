export type Role = 'admin' | 'operator' | 'user';

export interface UserProfile {
  id: string; // Referencia a auth.users.id
  nombre: string;
  email: string;
  role: Role;
  estado_activo: boolean;
  fecha_registro: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ContactData {
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
}

export interface ContactMessageResponse {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string | null;
  body: string;
  status: 'unread' | 'in_progress' | 'replied' | 'archived';
  fecha_envio: string;
}