'use client';

import { useState, useEffect } from 'react';
import { Plus, Search as SearchIcon, Clock, X, Loader2 } from 'lucide-react';
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [saving, setSaving] = useState(false);
  
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
        // If table doesn't exist, we just ignore to not break UI
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

  const handleSaveNote = async () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: newTitle || 'Untitled Note',
          content: newContent,
          tags: ['Personal']
        });

      if (error) throw error;
      
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
      fetchNotes(); // Refresh list
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save note. Please ensure the notes table exists in your database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Notes</h1>
          <p style={{ color: 'var(--secondary)' }}>Manage your thoughts and ideas securely.</p>
        </div>
        <button className={styles.newButton} onClick={() => setIsModalOpen(true)}>
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
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteTitle}>{note.title}</div>
              <p className={styles.notePreview}>{note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}</p>
              <div className={styles.noteFooter}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} />
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
                <div className={styles.tag}>{note.tags?.[0] || 'Note'}</div>
              </div>
            </div>
          ))}
          
          <div className={styles.noteCard} onClick={() => setIsModalOpen(true)} style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', color: 'var(--secondary)', cursor: 'pointer' }}>
            <Plus size={32} />
            <span style={{ fontWeight: 600, marginTop: '1rem' }}>Create Note</span>
          </div>
        </div>
      )}

      {/* Note Creation Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Write a Note</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--secondary)" />
              </button>
            </div>
            
            <input 
              type="text" 
              placeholder="Note Title" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1.1rem', outline: 'none' }}
            />
            
            <textarea 
              placeholder="What's on your mind?" 
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              style={{ width: '100%', padding: '1rem', height: '200px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', resize: 'vertical', outline: 'none', marginBottom: '1.5rem', fontFamily: 'inherit' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                disabled={saving || (!newTitle && !newContent)}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (saving || (!newTitle && !newContent)) ? 0.7 : 1 }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
