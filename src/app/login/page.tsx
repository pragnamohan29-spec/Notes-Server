'use client';

import { createClient } from '@/lib/supabase/client';
import { Sparkles, CheckCircle2, Zap, Shield, Globe } from 'lucide-react';
import styles from '../../styles/login.module.css';

export default function LoginPage() {
  const supabase = createClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.hero}>
        <div className={styles.intro}>
          <div className={styles.badge}>Next Gen Productivity</div>
          <h1 className={styles.title}>Unlock Your <br/> Intelligent Workflow.</h1>
          <p className={styles.subtitle}>
            Aura AI combines your notes, video summaries, and research insights into a single, cohesive experience powered by cutting-edge AI.
          </p>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <Zap className={styles.specIcon} size={20} />
              <span>Gemini 1.5 Pro AI</span>
            </div>
            <div className={styles.specItem}>
              <Shield className={styles.specIcon} size={20} />
              <span>Secure Supabase Auth</span>
            </div>
            <div className={styles.specItem}>
              <Globe className={styles.specIcon} size={20} />
              <span>Deep Web Research</span>
            </div>
            <div className={styles.specItem}>
              <CheckCircle2 className={styles.specIcon} size={20} />
              <span>Real-time Syncing</span>
            </div>
          </div>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <span style={{ fontWeight: 800 }}>NS</span>
              </div>
              <span className={styles.logoText}>Notes Server</span>
            </div>
            <h2>Welcome to the future</h2>
            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Sign in to start your journey.</p>
          </div>

          <button onClick={handleSignIn} className={styles.googleButton}>
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              style={{ width: 18, height: 18 }}
            />
            <span>Continue with Google</span>
          </button>

          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--secondary)', textAlign: 'center' }}>
            By continuing, you agree to Notes Server&apos;s <br />
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Terms</a> and <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Privacy</a>.
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
          &copy; {new Date().getFullYear()} Notes Server. All rights reserved.
      </footer>
    </div>
  );
}
