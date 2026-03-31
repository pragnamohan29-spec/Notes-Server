'use client';

import { useState } from 'react';
import { Search as SearchIcon, Loader2, PlusCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResearchAssistantProps {
  onInsert: (content: string) => void;
}

export default function ResearchAssistant({ onInsert }: ResearchAssistantProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [inserted, setInserted] = useState(false);
  const [error, setError] = useState('');

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    setInserted(false);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Research failed');
      
      setResult(data.report);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch research context.');
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (!result) return;
    onInsert(result);
    setInserted(true);
    setTimeout(() => setInserted(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fcfcfc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <SearchIcon size={18} color="var(--primary)" />
          Deep Research AI
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: 0 }}>
          Ask any question to generate highly relevant context for your note.
        </p>
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. What are the ethical implications of quantum computing in the next 10 years?"
          style={{ width: '100%', height: '80px', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', resize: 'none', outline: 'none', fontFamily: 'inherit', marginBottom: '0.75rem' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleResearch();
            }
          }}
        />
        <button
          onClick={handleResearch}
          disabled={loading || !query.trim()}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: (loading || !query.trim()) ? 0.7 : 1, transition: 'all 0.2s' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Synthesizing...
            </>
          ) : (
            <>
              <SearchIcon size={18} />
              Run Research
            </>
          )}
        </button>
      </div>

      {/* Results Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#f8fafc' }}>
        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {!result && !loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', textAlign: 'center', gap: '1rem' }}>
            <SearchIcon size={48} opacity={0.2} />
            <p>Your research findings will appear here.</p>
          </div>
        )}

        {result && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: 0, paddingBottom: '1rem', zIndex: 10 }}>
              <button
                onClick={handleInsert}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: inserted ? '#22c55e' : '#fff',
                  color: inserted ? '#fff' : 'var(--primary)',
                  border: inserted ? 'none' : '1px solid var(--primary)',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
              >
                {inserted ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
                {inserted ? 'Inserted!' : 'Insert into Note'}
              </button>
            </div>
            
            <div className="prose prose-sm prose-slate max-w-none" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#334155' }}>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Global CSS for Markdown in assistant */}
      <style dangerouslySetInnerHTML={{__html: `
        .prose h1, .prose h2, .prose h3 { color: #0f172a; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; }
        .prose p { margin-bottom: 1em; }
        .prose ul { padding-left: 1.5em; list-style-type: disc; margin-bottom: 1em; }
        .prose li { margin-bottom: 0.25em; }
        .prose strong { color: #0f172a; font-weight: 600; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
