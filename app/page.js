'use client';

import { useState } from 'react';
import './landing.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>ResumeForge</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="landing-hero">
        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Resume Builder
          </div>
          <h1 className="hero-title">
            Build Your Dream Resume
            <span className="hero-accent"> in Minutes</span>
          </h1>
          <p className="hero-subtitle">
            Choose from stunning templates, let AI craft your content, and download
            a professional PDF — all in one place.
          </p>

          {/* Login Form */}
          <form className="hero-form" onSubmit={handleLogin}>
            <div className="form-row">
              <input
                type="email"
                className="hero-input"
                placeholder="Enter your email to get started"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-lg hero-btn" disabled={loading}>
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    Get Started
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {error && <p className="hero-error">{error}</p>}
            <p className="hero-hint">No password needed — just your email</p>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          <div className="feature-card" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon feature-icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <h3>Beautiful Templates</h3>
            <p>Choose from curated professional templates designed to impress</p>
          </div>

          <div className="feature-card" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon feature-icon-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3>AI Assistance</h3>
            <p>Let AI generate summaries, enhance descriptions, and suggest skills</p>
          </div>

          <div className="feature-card" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon feature-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3>PDF Download</h3>
            <p>Download your finished resume as a crisp, professional PDF</p>
          </div>
        </div>
      </main>
    </div>
  );
}
