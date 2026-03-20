import { Plus, Search as SearchIcon, FileText, Clock, Tag } from 'lucide-react';
import styles from '../../../styles/notes.module.css';

export default function NotesPage() {
  const notes = [
    { id: 1, title: 'Project Roadmap', content: 'Define key milestones and architecture for the new AI productivity app. Focus on Supabase and Next.js integration...', date: 'Mar 19, 2024', tag: 'Work' },
    { id: 2, title: 'Meeting Notes: Design Sync', content: 'Discuss glassmorphism vs neumorphism for the main dashboard. User prefers sleek, dark-themed UI with micro-animations.', date: 'Mar 18, 2024', tag: 'Design' },
    { id: 3, title: 'Grocery List', content: 'Apple, Milk, Eggs, Bread, Spinach, Avocado, Chicken Breast, Almonds, Coffee Beans...', date: 'Mar 17, 2024', tag: 'Personal' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Notes</h1>
          <p style={{ color: 'var(--secondary)' }}>Manage your thoughts and ideas.</p>
        </div>
        <button className={styles.newButton}>
          <Plus size={20} />
          <span>New Note</span>
        </button>
      </header>

      <div className={styles.searchBar}>
        <SearchIcon size={18} color="var(--secondary)" />
        <input 
          type="text" 
          placeholder="Search notes..." 
          className={styles.searchInput} 
        />
      </div>

      <div className={styles.noteGrid}>
        {notes.map((note) => (
          <div key={note.id} className={styles.noteCard}>
            <div className={styles.noteTitle}>{note.title}</div>
            <p className={styles.notePreview}>{note.content}</p>
            <div className={styles.noteFooter}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} />
                <span>{note.date}</span>
              </div>
              <div className={styles.tag}>{note.tag}</div>
            </div>
          </div>
        ))}
        
        {/* Empty State / Add Card */}
        <div className={styles.noteCard} style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', color: 'var(--secondary)' }}>
          <Plus size={32} />
          <span style={{ fontWeight: 600, marginTop: '1rem' }}>Create Note</span>
        </div>
      </div>
    </div>
  );
}
