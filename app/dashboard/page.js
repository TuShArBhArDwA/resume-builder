'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import TemplateSelectionModal from '@/components/TemplateSelectionModal';
import ResumePreview from '@/components/ResumePreview';
import './dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const router = useRouter();

  // Check for user session on mount (shorthand auth)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(stored);
    setUser(userData);
    fetchResumes(userData.id);
  }, [router]);

  // Load all resumes for the logged-in user
  const fetchResumes = async (userId) => {
    try {
      const res = await fetch(`/api/resumes?user_id=${userId}`);
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (templateId = 'classic') => {
    try {
      setLoading(true);
      setShowTemplateModal(false);
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, template_id: templateId }),
      });
      const data = await res.json();
      if (data.resume) {
        router.push(`/editor/${data.resume.id}`);
      }
    } catch (err) {
      setLoading(false);
      showToast('Failed to create resume', 'error');
    }
  };

  const deleteResume = async (id) => {
    try {
      await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      setResumes(resumes.filter((r) => r.id !== id));
      showToast('Resume deleted');
      setDeleteConfirm(null);
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowUpgrade(false);
        showToast('🎉 Upgraded to Pro!');
      }
    } catch (err) {
      showToast('Upgrade failed', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Resumes</h1>
            <p className="dashboard-subtitle">Create, edit, and manage your resumes</p>
          </div>
          <div className="dashboard-header-actions">
            {!user.is_upgraded && (
              <button className="btn btn-gold" onClick={() => setShowUpgrade(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Upgrade to Pro
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setShowTemplateModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Resume
            </button>
          </div>
        </div>

        {/* Resume Grid */}
        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner" style={{ width: 32, height: 32 }}></div>
            <p>Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3>No resumes yet</h3>
            <p>Create your first resume and start building your career story</p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowTemplateModal(true)} style={{ marginTop: '1rem' }}>
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map((resume, i) => (
              <div key={resume.id} className="resume-card card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="resume-card-preview">
                  <div className="resume-preview-thumbnail">
                    <ResumePreview 
                      templateId={resume.template_id || 'classic'} 
                      data={{
                        personal_info: resume.personal_info,
                        summary: resume.summary,
                        experience: resume.experience,
                        education: resume.education,
                        skills: resume.skills,
                        custom_sections: resume.personal_info?.custom_sections || []
                      }} 
                    />
                  </div>
                  <div className="resume-card-template-badge">
                    {resume.template_id || 'classic'}
                  </div>
                </div>
                <div className="resume-card-body">
                  <h3 className="resume-card-title">{resume.title || 'Untitled Resume'}</h3>
                  <p className="resume-card-meta">
                    Last edited {formatDate(resume.updated_at)}
                  </p>
                  <div className="resume-card-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push(`/editor/${resume.id}`)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteConfirm(resume.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <div className="resume-card-new" onClick={() => setShowTemplateModal(true)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New Resume</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete Resume?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteResume(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={handleUpgrade} />
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <TemplateSelectionModal 
          user={user} 
          onClose={() => setShowTemplateModal(false)} 
          onSelect={(templateId) => createResume(templateId)} 
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
