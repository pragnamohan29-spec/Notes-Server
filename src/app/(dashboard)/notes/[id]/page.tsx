'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, FileDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Editor from '@/components/Editor';
import ResearchAssistant from '@/components/ResearchAssistant';

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const isNewNote = params.id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNewNote) {
      setLoading(false);
      return;
    }
    
    // Fetch existing note if editing
    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error) throw error;
        if (data) {
          setTitle(data.title);
          setContent(data.content || '');
        }
      } catch (err) {
        console.error('Failed to load note:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [params.id, isNewNote, supabase]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const noteData = {
        title: title.trim() || 'Untitled Note',
        content,
        user_id: user.id,
      };

      if (isNewNote) {
        const { data, error } = await supabase.from('notes').insert({ ...noteData, tags: ['Research'] }).select().single();
        if (error) throw error;
        if (data) router.replace(`/notes/${data.id}`);
      } else {
        const { error } = await supabase.from('notes').update({
          ...noteData,
          updated_at: new Date().toISOString()
        }).eq('id', params.id);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('Error saving note.');
    } finally {
      setSaving(false);
    }
  };

  const insertResearch = (markdownContext: string) => {
    // Append the newly researched string exactly as HTML tags to feed directly to tiptap
    const htmlSnippet = markdownContext
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .split('\n')
      .map(line => {
        if (line.match(/<h|<blockquote|<ul>|<li/)) return line;
        if (line.trim().startsWith('- ')) return `<ul><li>${line.substring(2)}</li></ul>`;
        return line.trim() ? `<p>${line}</p>` : '<br/>';
      })
      .join('');
      
    // Append to existing content
    setContent(prevContent => prevContent + '<br/><h2>Research Notes</h2>' + htmlSnippet);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingLeft: '240px' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <button 
            onClick={() => router.push('/notes')}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <ArrowLeft size={20} />
          </button>
          
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Note Title..."
            style={{ fontSize: '2rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', width: '100%', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.3)', transition: 'all 0.2s', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Full Rich Text Editor */}
        <div style={{ flex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Editor content={content} onChange={setContent} />
        </div>

        {/* Right Side: Deep Research Assistant */}
        <div style={{ flex: 1, minWidth: '350px', height: '100%' }}>
          <ResearchAssistant onInsert={insertResearch} />
        </div>
      </div>

    </div>
  );
}
