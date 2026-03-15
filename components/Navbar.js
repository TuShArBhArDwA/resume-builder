'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="navbar">
      <a href="/dashboard" className="navbar-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>CVFlow</span>
      </a>

      <div className="navbar-actions">
        {user && (
          <>
            <a href="/templates" className="btn btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Templates
            </a>
            <span className="navbar-email">{user.email}</span>
            {user.is_upgraded && (
              <span className="badge badge-premium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                PRO
              </span>
            )}
            <ThemeToggle />
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 2rem;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(12px);
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          text-decoration: none;
        }
        .navbar-logo svg {
          color: var(--accent-primary);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .navbar-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .navbar {
            padding: 0.75rem 1rem;
          }
          .navbar-email {
            display: none;
          }
          .navbar-logo span {
            font-size: 0.95rem;
          }
          .navbar-actions {
            gap: 0.5rem;
          }
          .btn-ghost {
            padding: 0.4rem 0.6rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </nav>
  );
}
