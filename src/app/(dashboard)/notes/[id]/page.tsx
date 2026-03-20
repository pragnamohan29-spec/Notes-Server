'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { getNotes, updateNote, deleteNote, createNote, Note } from '@/lib/notes';
import NoteEditor from '@/components/NoteEditor';
import styles from '../../../../styles/notes.module.css';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';
  
  const [note, setNote] = useState<Partial<Note> | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadNote();
    } else {
      setNote({ title: '', content: { type: 'doc', content: [] }, tag: 'Personal' });
    }
  }, [params.id]);

  async function loadNote() {
    try {
      const notes = await getNotes();
      const found = notes.find(n => n.id === params.id);
      if (found) {
        setNote(found);
      } else {
        router.push('/notes');
      }
    } catch (error) {
      console.error('Failed to load note:', error);
      router.push('/notes');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!note || !note.title) return;
    setSaving(true);
    try {
      if (isNew) {
        await createNote(note);
      } else {
        await updateNote(params.id, note);
      }
      router.push('/notes');
      router.refresh();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (isNew) {
      router.push('/notes');
      return;
    }
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await deleteNote(params.id);
      router.push('/notes');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/notes')} className={styles.menuButton}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!isNew && (
            <button onClick={handleDelete} className={styles.menuButton} style={{ color: '#ff4444' }}>
              <Trash2 size={20} />
            </button>
          )}
          <button 
            onClick={handleSave} 
            className={styles.newButton} 
            disabled={saving || !note.title}
            style={{ minWidth: '100px', justifyContent: 'center' }}
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span style={{ marginLeft: '0.5rem' }}>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <input 
            type="text" 
            placeholder="Note Title" 
            className={styles.titleInput}
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Personal', 'Work', 'Ideas', 'Design'].map((t) => (
              <button
                key={t}
                onClick={() => setNote({ ...note, tag: t })}
                className={`${styles.tag} ${note.tag === t ? '' : styles.tagInactive}`}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <NoteEditor 
          content={note.content} 
          onChange={(content) => setNote({ ...note, content })} 
        />
      </div>
    </div>
  );
}
