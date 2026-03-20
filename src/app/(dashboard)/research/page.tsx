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
    
    // Simulate multi-step loading
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 1500));
    }

    setResults({
      answer: `
        <h2>Research Findings: ${query}</h2>
        <p>Based on a comprehensive search of academic papers and industry reports, here is a detailed synthesis of your query.</p>
        
        <h3>Current Trends</h3>
        <p>The field is rapidly evolving with major players investing heavily in distributed AI systems. Recent breakthroughs suggest a 40% increase in efficiency when utilizing decentralized compute frameworks [1].</p>
        
        <h3>Key Challenges</h3>
        <p>Privacy and data sovereignty remain the primary blockers for enterprise adoption. Regulatory frameworks like GDPR and the upcoming EU AI Act are forcing companies to rethink their data pipelines [2].</p>
        
        <h3>Future Outlook</h3>
        <p>Experts predict a shift towards "Federated Learning" models that allow for collaborative AI training without compromising individual data privacy [3].</p>
      `,
      sources: [
        { id: 1, title: 'AI Infrastructure Report 2024', url: 'https://example.com/report' },
        { id: 2, title: 'Journal of Future Compute', url: 'https://example.com/journal' },
        { id: 3, title: 'TechCrunch Analysis: AI Sovereignty', url: 'https://techcrunch.com/analysis' },
      ]
    });
    setLoading(false);
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
