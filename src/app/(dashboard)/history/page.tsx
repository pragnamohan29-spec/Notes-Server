'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Search, 
  Clock, 
  X, 
  FileText, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/history.module.css';

interface ResearchItem {
  id: string;
  query: string;
  results: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState<ResearchItem | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('research_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
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
        <h1 className={styles.title}>Research History</h1>
        <p className={styles.subtitle}>Relive and review your previous AI deep research sessions.</p>
      </header>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className="animate-spin" size={48} />
          <p style={{ marginTop: '1rem' }}>Loading your research history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className={styles.emptyState}>
          <Search size={48} style={{ marginBottom: '1rem' }} />
          <h3>No research history found</h3>
          <p>Start your first deep research to see it here.</p>
        </div>
      ) : (
        <div className={styles.historyGrid}>
          {history.map((item) => (
            <div 
              key={item.id} 
              className={styles.historyCard}
              onClick={() => setSelectedResearch(item)}
            >
              <div className={styles.query}>{item.query}</div>
              <div className={styles.date}>
                <Clock size={16} />
                <span>{formatDate(item.created_at)}</span>
              </div>
              <p className={styles.preview}>
                {item.results.substring(0, 150)}...
              </p>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginTop: 'auto' }}>
                View Full Report <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedResearch && (
        <div className={styles.modal} onClick={() => setSelectedResearch(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedResearch(null)}
            >
              <X size={24} />
            </button>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {selectedResearch.query}
              </h2>
              <div className={styles.date}>
                <Clock size={16} />
                <span>Performed on {formatDate(selectedResearch.created_at)}</span>
              </div>
            </div>
            <div className={styles.resultsMarkdown}>
              <ReactMarkdown>{selectedResearch.results}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
