import { supabase } from '../lib/supabase';

export interface ContactData {
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
}

export async function createContactMessage(data: ContactData): Promise<void> {
  const trimmedName = data.sender_name?.trim();
  const trimmedEmail = data.sender_email?.trim().toLowerCase();
  const trimmedSubject = data.subject?.trim() || 'Consulta General';
  const trimmedBody = data.body?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedBody) {
    throw new Error('Todos los campos requeridos deben estar completos.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new Error('El formato del correo electrónico no es válido.');
  }

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_name: trimmedName,
        sender_email: trimmedEmail,
        subject: trimmedSubject,
        body: trimmedBody,
        status: 'unread',
      },
    ]);

  if (error) {
    console.error('Error insertando en messages:', error);
    throw new Error(error.message || 'Error al guardar el mensaje.');
  }
}