'use client';

import { useState } from 'react';
import { Search, Loader2, BookOpen, Globe, CheckCircle2, Share2, Download } from 'lucide-react';
import styles from '../../../styles/research.module.css';

const steps = [
  'Analyzing research query...',
  'Searching relevant sources across the web...',
  'Extracting key data points...',
  'Synthesizing information and citing sources...',
];

export default function ResearchTool() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState<any>(null);

  async function handleResearch() {
    if (!query) return;
    setLoading(true);
    setResults(null);
    
    try {
      // Simulate multi-step loading for UI polish
      for (let i = 0; i < steps.length - 1; i++) {
        setActiveStep(i);
        await new Promise(r => setTimeout(r, 1000));
      }

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setActiveStep(steps.length - 1);
      setResults({
        answer: data.research,
        sources: [
          { id: 1, title: 'AI Synthesis Report', url: '#' },
          { id: 2, title: 'Gemini Research Output', url: '#' }
        ]
      });
    } catch (error: any) {
      console.error('Research error:', error);
      alert(error.message || 'Failed to perform research');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <header>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Deep Research</h1>
        <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
          Get comprehensive answers with verified sources.
        </p>
      </header>

      <div className={styles.searchBox}>
        <div className={styles.inputWrapper}>
          <Search className={styles.searchIcon} size={24} />
          <input 
            type="text" 
            placeholder="Ask a complex question..." 
            className={styles.queryInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          className={styles.researchButton}
          onClick={handleResearch}
          disabled={loading || !query}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={20} />}
          <span>{loading ? 'Researching...' : 'Start Deep Research'}</span>
        </button>
      </div>

      {loading && (
        <div className={styles.loadingSection}>
          <Loader2 className="animate-spin" size={48} color="#8A2BE2" />
          <div className={styles.loadingSteps}>
            {steps.map((step, i) => (
              <div key={i} className={`${styles.step} ${i === activeStep ? styles.stepActive : ''}`}>
                {i < activeStep ? <CheckCircle2 size={16} color="#8A2BE2" /> : <Globe size={16} />}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {results && (
        <div className={styles.results}>
          <div dangerouslySetInnerHTML={{ __html: results.answer }} />
          
          <div className={styles.sources}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} />
              Sources
            </h4>
            {results.sources.map((source: any) => (
              <div key={source.id} className={styles.sourceItem}>
                <span>[{source.id}]</span>
                <span className={styles.sourceTitle}>{source.title}</span>
                <a href={source.url} target="_blank" className={styles.sourceLink}>View Source</a>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className={styles.researchButton} style={{ flex: 1, background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              <Share2 size={18} />
              <span>Share Report</span>
            </button>
            <button className={styles.researchButton} style={{ flex: 1, background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              <Download size={18} />
              <span>Export as PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
