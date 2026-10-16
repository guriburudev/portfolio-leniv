import { supabase } from '../lib/supabase';

export interface ContactData {
  sender_name: string;
  sender_email: string;
  subject: string;
  body: string;
}

export async function createContactMessage(data: ContactData): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_name: data.sender_name,
        sender_email: data.sender_email,
        subject: data.subject,
        body: data.body,
      },
    ]);

  if (error) {
    console.error('Error insertando en messages:', error);
    throw new Error(error.message || 'Error al guardar el mensaje');
  }
}