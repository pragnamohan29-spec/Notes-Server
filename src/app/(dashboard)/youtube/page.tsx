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
    setResult(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult({
        title: 'Video Summary',
        channel: 'YouTube Video',
        summary: data.summary
      });
    } catch (error: any) {
      console.error('Summarization error:', error);
      alert(error.message || 'Failed to summarize video');
    } finally {
      setLoading(false);
    }
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
