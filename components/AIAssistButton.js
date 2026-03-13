'use client';

import { useState } from 'react';

export default function AIAssistButton({ type, context, onResult }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context }),
      });

      const data = await res.json();
      if (data.error) {
        console.error('AI error:', data.error);
        return;
      }

      onResult(data.result, data.isFallback);
    } catch (err) {
      console.error('AI request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    summary: '✨ Generate Summary',
    experience: '✨ Improve Description',
    skills: '✨ Suggest Skills',
  };

  return (
    <button
      type="button"
      className="ai-assist-btn"
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="spinner" style={{ width: 14, height: 14 }}></div>
          <span>Generating...</span>
        </>
      ) : (
        <span>{labels[type] || '✨ AI Assist'}</span>
      )}

      <style jsx>{`
        .ai-assist-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.7rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--accent-primary);
          background: rgba(108, 99, 255, 0.1);
          border: 1px solid rgba(108, 99, 255, 0.2);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
          white-space: nowrap;
        }
        .ai-assist-btn:hover:not(:disabled) {
          background: rgba(108, 99, 255, 0.2);
          border-color: var(--accent-primary);
          box-shadow: 0 0 12px var(--accent-primary-glow);
        }
        .ai-assist-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
