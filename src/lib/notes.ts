import { createClient } from './supabase/client';

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: any;
  tag?: string;
  created_at: string;
  updated_at: string;
};

export async function getNotes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as Note[];
}

export async function createNote(note: Partial<Note>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...note, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(id: string, note: Partial<Note>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .match({ id, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('notes')
    .delete()
    .match({ id });

  if (error) throw error;
}
