'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Clock, 
  X, 
  Youtube,
  ChevronRight,
  Loader2,
  History
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/history.module.css';

interface HistoryItem {
  id: string;
  type: 'research' | 'youtube';
  title: string;
  content: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch both history types in parallel
      const [researchRes, youtubeRes] = await Promise.all([
        supabase.from('research_history').select('*'),
        supabase.from('youtube_history').select('*')
      ]);

      if (researchRes.error) throw researchRes.error;
      if (youtubeRes.error) throw youtubeRes.error;

      // Map Research items
      const researchItems: HistoryItem[] = (researchRes.data || []).map(item => ({
        id: `res-${item.id}`,
        type: 'research',
        title: item.query,
        content: item.results,
        created_at: item.created_at
      }));

      // Map YouTube items
      const youtubeItems: HistoryItem[] = (youtubeRes.data || []).map(item => ({
        id: `yt-${item.id}`,
        type: 'youtube',
        title: `YouTube Video: ${item.video_id}`,
        content: item.summary,
        created_at: item.created_at
      }));

      // Combine and sort by newest first
      const combinedHistory = [...researchItems, ...youtubeItems].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setHistory(combinedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Unified History</h1>
        <p className={styles.subtitle}>Relive and review your previous Deep Research and YouTube summaries.</p>
      </header>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
          <p style={{ marginTop: '1rem' }}>Loading your consolidated history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className={styles.emptyState}>
          <History size={48} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <h3>No history found</h3>
          <p>Start your first Deep Research or YouTube summary to see it here.</p>
        </div>
      ) : (
        <div className={styles.historyGrid}>
          {history.map((item) => (
            <div 
              key={item.id} 
              className={styles.historyCard}
              onClick={() => setSelectedItem(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {item.type === 'research' ? (
                  <div style={{ padding: '0.4rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                    <Search size={16} />
                  </div>
                ) : (
                  <div style={{ padding: '0.4rem', background: 'rgba(255, 0, 0, 0.1)', borderRadius: '0.5rem', color: '#FF0000' }}>
                    <Youtube size={16} />
                  </div>
                )}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
                  {item.type}
                </span>
              </div>
              
              <div className={styles.query}>{item.title}</div>
              
              <div className={styles.date}>
                <Clock size={16} />
                <span>{formatDate(item.created_at)}</span>
              </div>
              
              <p className={styles.preview}>
                {item.content.substring(0, 150)}...
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginTop: 'auto' }}>
                View Full Item <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className={styles.modal} onClick={() => setSelectedItem(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                {selectedItem.type === 'research' ? <Search size={24} color="var(--primary)" /> : <Youtube size={24} color="#FF0000" />}
                <span style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)' }}>
                  {selectedItem.type}
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {selectedItem.title}
              </h2>
              <div className={styles.date}>
                <Clock size={16} />
                <span>Performed on {formatDate(selectedItem.created_at)}</span>
              </div>
            </div>
            <div className={styles.resultsMarkdown}>
              <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
