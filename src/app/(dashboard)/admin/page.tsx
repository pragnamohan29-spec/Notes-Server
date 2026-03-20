import { Users, BarChart3, Shield, Activity, Search, Filter, MoreVertical } from 'lucide-react';
import styles from '../../../styles/admin.module.css';

export default function AdminDashboard() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', usage: '1.2 GB' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', usage: '450 MB' },
    { id: 3, name: 'Robert Brown', email: 'robert@example.com', role: 'User', status: 'Inactive', usage: '0 MB' },
    { id: 4, name: 'Alice White', email: 'alice@example.com', role: 'User', status: 'Active', usage: '890 MB' },
  ];

  return (
    <div className={styles.container}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--secondary)' }}>System overview and user management.</p>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Users size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', color: '#008800' }}>+12%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,284</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Activity size={20} color="#FF9500" />
            <span style={{ fontSize: '0.75rem', color: '#008800' }}>+5%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>452</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Active Now</div>
        </div>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <BarChart3 size={20} color="#8A2BE2" />
            <span style={{ fontSize: '0.75rem', color: '#cc0000' }}>-2%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12.5 TB</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Storage Used</div>
        </div>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Shield size={20} color="#00C7BE" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>99.9%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>System Uptime</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontWeight: 700 }}>User Management</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
              <Search size={16} />
              <input type="text" placeholder="Filter users..." style={{ border: 'none', background: 'transparent', outline: 'none' }} />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', background: 'var(--background)', cursor: 'pointer' }}>
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Usage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{user.email}</div>
                </td>
                <td>{user.role}</td>
                <td>
                  <span className={`${styles.status} ${user.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.usage}</td>
                <td>
                  <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--secondary)' }}>
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
