'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Made with 💙 by{' '}
        <a href="https://minianonlink.vercel.app/tusharbhardwaj" target="_blank" rel="noopener noreferrer">
          Tushar Bhardwaj
        </a>
      </p>
      <style jsx>{`
        .site-footer {
          text-align: center;
          padding: 1.5rem;
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.9rem;
          background: var(--bg-primary);
        }
        .site-footer a {
          color: var(--accent-primary);
          font-weight: 500;
          text-decoration: none;
        }
        .site-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}
