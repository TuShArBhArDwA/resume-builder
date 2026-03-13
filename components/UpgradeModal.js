'use client';

import { useState } from 'react';

export default function UpgradeModal({ onClose, onUpgrade }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await onUpgrade();
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-header">
          <div className="upgrade-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2>Upgrade to Pro</h2>
          <p>Unlock premium templates and features</p>
        </div>

        <div className="upgrade-features">
          <div className="upgrade-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Executive Template</span>
          </div>
          <div className="upgrade-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>All future premium templates</span>
          </div>
          <div className="upgrade-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Priority AI assistance</span>
          </div>
        </div>

        <div className="upgrade-actions">
          <button
            className="btn btn-gold btn-lg"
            onClick={handleUpgrade}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? <div className="spinner"></div> : 'Upgrade Now — Free Demo'}
          </button>
          <button className="btn btn-ghost" onClick={onClose} style={{ width: '100%' }}>
            Maybe Later
          </button>
        </div>

        <style jsx>{`
          .upgrade-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }
          .upgrade-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--gradient-gold);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            color: #1a1a2e;
          }
          .upgrade-header h2 {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
          .upgrade-header p {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
          .upgrade-features {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: var(--radius-md);
          }
          .upgrade-feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.9rem;
          }
          .upgrade-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        `}</style>
      </div>
    </div>
  );
}
