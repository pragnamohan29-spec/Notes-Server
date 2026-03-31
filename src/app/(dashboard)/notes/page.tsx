'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search as SearchIcon, Clock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from '../../../styles/notes.module.css';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        if (error.code !== '42P01') console.error('Error fetching notes:', error);
        return;
      }
      
      if (data) setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Notes</h1>
          <p style={{ color: 'var(--secondary)' }}>Manage your thoughts and ideas securely.</p>
        </div>
        <button className={styles.newButton} onClick={() => router.push('/notes/new')}>
          <Plus size={20} />
          <span>New Note</span>
        </button>
      </header>

      <div className={styles.searchBar}>
        <SearchIcon size={18} color="var(--secondary)" />
        <input 
          type="text" 
          placeholder="Search securely synced notes..." 
          className={styles.searchInput} 
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div className={styles.noteGrid}>
          {notes.map((note) => (
            <div key={note.id} className={styles.noteCard} onClick={() => router.push(`/notes/${note.id}`)} style={{ cursor: 'pointer' }}>
              <div className={styles.noteTitle}>{note.title}</div>
              <p className={styles.notePreview}>{note.content.substring(0, 100).replace(/<[^>]*>?/gm, '')}{note.content.length > 100 ? '...' : ''}</p>
              <div className={styles.noteFooter}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} />
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                <div className={styles.tag}>{note.tags?.[0] || 'Note'}</div>
              </div>
            </div>
          ))}
          
          <div className={styles.noteCard} onClick={() => router.push('/notes/new')} style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', color: 'var(--secondary)', cursor: 'pointer' }}>
            <Plus size={32} />
            <span style={{ fontWeight: 600, marginTop: '1rem' }}>Create Note</span>
          </div>
        </div>
      )}
    </div>
  );
}
