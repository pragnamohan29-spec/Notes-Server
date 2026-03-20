'use client';

import { useState } from 'react';
import { Youtube, Sparkles, Copy, StickyNote, Loader2, ArrowRight } from 'lucide-react';
import styles from '../../../styles/youtube.module.css';

export default function YoutubeSummarizer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSummarize() {
    if (!url) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        title: 'How to Build a Second Brain with AI',
        channel: 'Tiago Forte',
        thumbnail: 'https://img.youtube.com/vi/placeholder/maxresdefault.jpg',
        summary: `
          <h3>Key Takeaways</h3>
          <ul>
            <li><strong>The Power of Capture:</strong> AI can now automate the capture process, making it easier to gather information from various sources without manual effort.</li>
            <li><strong>AI-Assisted Curation:</strong> Use LLMs to summarize long documents and videos, allowing you to focus on high-level synthesis rather than consuming everything.</li>
            <li><strong>The CODE Method:</strong> Capture, Organize, Distill, Express. AI particularly excels at the "Distill" phase by identifying core themes.</li>
            <li><strong>Future of Productivity:</strong> We are moving towards "Human-AI Co-creation" where our digital systems act as proactive partners.</li>
          </ul>
          <h3>Conclusion</h3>
          <p>By integrating AI into your productivity workflow, you can handle significantly more information while reducing the cognitive load of management.</p>
        `
      });
      setLoading(false);
    }, 2000);
  }

  return (
    <div className={styles.container}>
      <header>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>YouTube Summarizer</h1>
        <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
          Extract key insights from any video in seconds.
        </p>
      </header>

      <div className={styles.inputSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FF0000' }}>
          <Youtube size={24} />
          <span style={{ fontWeight: 700 }}>Paste YouTube URL</span>
        </div>
        <input 
          type="text" 
          placeholder="https://www.youtube.com/watch?v=..." 
          className={styles.urlInput}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          className={styles.summarizeButton} 
          onClick={handleSummarize}
          disabled={loading || !url}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Sparkles size={20} />
          )}
          <span>{loading ? 'Summarizing...' : 'Generate Summary'}</span>
        </button>
      </div>

      {result && (
        <div className={styles.resultSection}>
          <div className={styles.videoInfo}>
            <div className={styles.thumbnail}></div>
            <div>
              <div className={styles.videoTitle}>{result.title}</div>
              <div className={styles.videoMeta}>{result.channel}</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div dangerouslySetInnerHTML={{ __html: result.summary }} />
            
            <div className={styles.actions} style={{ marginTop: '2rem' }}>
              <button className={styles.secondaryButton}>
                <Copy size={18} />
                <span>Copy to Clipboard</span>
              </button>
              <button className={styles.secondaryButton} style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                <StickyNote size={18} />
                <span>Save as Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
