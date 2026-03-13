'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UpgradeModal from '@/components/UpgradeModal';
import ResumePreview from '@/components/ResumePreview';
import './templates-page.css';

const DUMMY_DATA = {
  personal_info: {
    name: 'Alex Developer',
    title: 'Software Engineer',
    email: 'alex@cvflow.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexdev',
    photoUrl: 'https://res.cloudinary.com/dkdhdiqy0/image/upload/v1700000000/placeholder_avatar_dxfkqo.jpg', 
  },
  summary: 'Passionate software engineer with 5+ years of experience building scalable, high-performance web applications using modern Javascript frameworks.',
  experience: [
    { title: 'Senior Developer', company: 'Tech Corp', startDate: '2020', endDate: 'Present', description: 'Led frontend architecture.' }
  ],
  education: [
    { degree: 'B.S. Computer Science', school: 'University of Tech', startDate: '2016', endDate: '2020' }
  ],
  skills: ['React', 'Next.js', 'Node.js', 'TypeScript'],
  custom_sections: []
};

export default function TemplatesPage() {
  const [user, setUser] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const useTemplate = async (templateId) => {
    if (!user) return;

    if (templateId === 'executive' && !user.is_upgraded) {
      setShowUpgrade(true);
      return;
    }

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title: `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Resume`,
          template_id: templateId,
        }),
      });

      const data = await res.json();
      if (data.resume) {
        router.push(`/editor/${data.resume.id}`);
      }
    } catch (err) {
      showToast('Failed to create resume with this template', 'error');
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
        showToast('🎉 Upgraded to Pro! Premium templates unlocked.');
      }
    } catch (err) {
      showToast('Upgrade failed', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'A clean, traditional layout perfect for corporate and academic roles.',
      free: true,
      color: 'var(--bg-card)',
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'A striking two-column design that highlights your skills and experience.',
      free: true,
      color: 'linear-gradient(135deg, #1e293b, #0f172a)',
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Premium, elegant design for senior roles and leadership positions.',
      free: false,
      color: 'linear-gradient(135deg, #0f172a, #1e293b)',
    },
  ];

  if (!user) return null;

  return (
    <div className="templates-page">
      <Navbar />

      <div className="templates-container">
        <div className="templates-header">
          <h1 className="templates-title">Resume Templates</h1>
          <p className="templates-subtitle">Choose a design that fits your professional style</p>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card card">
              <div
                className="template-card-preview"
                style={{ height: '300px' }}
              >
                {!template.free && (
                  <div className="template-card-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    PRO
                  </div>
                )}
                <div className="template-preview-container">
                  <div className="template-preview-scale">
                    <ResumePreview templateId={template.id} data={DUMMY_DATA} />
                  </div>
                </div>
              </div>

              <div className="template-card-body">
                <div className="template-card-header">
                  <h3 className="template-card-title">{template.name}</h3>
                  {template.free ? (
                    <span className="badge badge-free">Free</span>
                  ) : user.is_upgraded ? (
                    <span className="badge badge-free">Unlocked</span>
                  ) : null}
                </div>
                <p className="template-card-desc">{template.description}</p>
                <div className="template-card-actions">
                  <button
                    className={`btn ${template.free || user.is_upgraded ? 'btn-primary' : 'btn-gold'} btn-lg`}
                    onClick={() => useTemplate(template.id)}
                    style={{ width: '100%' }}
                  >
                    {!template.free && !user.is_upgraded ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Upgrade to Use
                      </>
                    ) : (
                      'Use Template'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={handleUpgrade} />
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
