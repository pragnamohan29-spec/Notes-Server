'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import { Bold, Italic, Type, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content injections (like Research Assistant insertions) into Tiptap
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* TOOLBAR */}
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* FONT SELECTOR */}
        <div style={{ display: 'flex', borderRight: '1px solid #cbd5e1', paddingRight: '0.5rem', marginRight: '0.5rem', gap: '0.25rem' }}>
          <button
            onClick={() => editor.chain().focus().setFontFamily('Inter, sans-serif').run()}
            className={editor.isActive('textStyle', { fontFamily: 'Inter, sans-serif' }) ? 'active-btn' : 'toolbar-btn'}
            style={{ fontFamily: 'Inter, sans-serif' }}
            title="Sans-Serif"
          >
            Sans
          </button>
          <button
            onClick={() => editor.chain().focus().setFontFamily('Merriweather, serif').run()}
            className={editor.isActive('textStyle', { fontFamily: 'Merriweather, serif' }) ? 'active-btn' : 'toolbar-btn'}
            style={{ fontFamily: 'Merriweather, serif' }}
            title="Serif"
          >
            Serif
          </button>
          <button
            onClick={() => editor.chain().focus().setFontFamily('monospace').run()}
            className={editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'active-btn' : 'toolbar-btn'}
            style={{ fontFamily: 'monospace' }}
            title="Monospace"
          >
            Mono
          </button>
        </div>

        {/* TEXT STYLES */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active-btn' : 'toolbar-btn'}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active-btn' : 'toolbar-btn'}
        >
          <Italic size={18} />
        </button>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 0.5rem' }} />

        {/* HEADINGS */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'active-btn' : 'toolbar-btn'}
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'active-btn' : 'toolbar-btn'}
        >
          <Heading2 size={18} />
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 0.5rem' }} />

        {/* LISTS */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active-btn' : 'toolbar-btn'}
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active-btn' : 'toolbar-btn'}
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'active-btn' : 'toolbar-btn'}
        >
          <Quote size={18} />
        </button>

      </div>

      {/* EDITOR CANVAS */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', outline: 'none', cursor: 'text' }}>
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>

      {/* Global CSS for the editor buttons */}
      <style dangerouslySetInnerHTML={{__html: `
        .toolbar-btn {
          background: transparent;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-weight: 500;
        }
        .toolbar-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .active-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        .active-btn:hover {
          opacity: 0.9;
        }
        .tiptap-editor .ProseMirror {
          outline: none;
          min-height: 400px;
        }
        .tiptap-editor .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .tiptap-editor .ProseMirror h1 {
          font-size: 2rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .tiptap-editor .ProseMirror blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1rem;
          color: #475569;
          font-style: italic;
          margin-left: 0;
        }
      `}} />
    </div>
  );
}
