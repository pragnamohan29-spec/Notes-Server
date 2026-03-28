'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  StickyNote, 
  Youtube, 
  Search, 
  Settings, 
  History,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import styles from '@/styles/layout.module.css';

const navItems = [
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Summarizer', href: '/youtube', icon: Youtube },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'History', href: '/history', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div style={{ 
          width: 32, 
          height: 32, 
          background: 'var(--primary)', 
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '0.75rem'
        }}>NS</div>
        <span>Notes Server</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/admin" className={`${styles.navItem} ${pathname === '/admin' ? styles.navItemActive : ''}`}>
          <ShieldCheck size={20} />
          <span>Admin Panel</span>
        </Link>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.user_metadata?.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.user_metadata?.full_name || 'Guest User'}</span>
            <span className={styles.userEmail}>{user?.email || 'guest@aura.ai'}</span>
          </div>
        </div>
        {!user ? (
          <button onClick={handleSignIn} className={styles.navItem} style={{ border: 'none', background: 'var(--primary)', color: 'white', width: '100%', textAlign: 'center', justifyContent: 'center' }}>
            <span>Sign In with Google</span>
          </button>
        ) : (
          <button onClick={handleSignOut} className={styles.navItem} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
