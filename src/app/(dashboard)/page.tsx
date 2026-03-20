import { StickyNote, Youtube, Search, Plus, ArrowRight } from 'lucide-react';
import styles from '../../styles/dashboard.module.css';

export default function Home() {
  return (
    <div>
      <header>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Welcome back, User</h1>
        <p style={{ color: 'var(--secondary)', marginTop: '0.5rem' }}>
          Your AI-powered productivity hub is ready.
        </p>
      </header>

      <section className={styles.statsGrid} style={{ marginTop: '2.5rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Notes</div>
          <div className={styles.statValue}>12</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Summaries</div>
          <div className={styles.statValue}>5</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Deep Research</div>
          <div className={styles.statValue}>3</div>
        </div>
      </section>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <StickyNote size={24} color="var(--primary)" />
            <span>New Note</span>
          </div>
          <p className={styles.cardDesc}>Capture your thoughts instantly with our rich-text editor.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Get started <Plus size={16} style={{ marginLeft: '0.25rem' }} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Youtube size={24} color="#FF0000" />
            <span>Summarize Video</span>
          </div>
          <p className={styles.cardDesc}>Paste a YouTube URL and get an AI-powered summary in seconds.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Try it out <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Search size={24} color="#8A2BE2" />
            <span>Deep Research</span>
          </div>
          <p className={styles.cardDesc}>Ask complex questions and let AI find answers across the web.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Start research <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
      </div>

      <div className={styles.recentList}>
        {[
          { title: 'Project Implementation Plan', type: 'Note', date: '2 hours ago', icon: StickyNote },
          { title: 'Understanding Quantum Computing', type: 'Summary', date: 'Yesterday', icon: Youtube },
          { title: 'Best Practices for Next.js 14', type: 'Research', date: '3 days ago', icon: Search },
        ].map((item, i) => (
          <div key={i} className={styles.recentItem}>
            <div className={styles.iconWrapper}>
              <item.icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{item.type} • {item.date}</div>
            </div>
            <ArrowRight size={16} color="var(--secondary)" />
          </div>
        ))}
      </div>
    </div>
  );
}
