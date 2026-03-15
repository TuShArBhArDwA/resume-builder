import React from 'react';
import ResumePreview from './ResumePreview';

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

export default function TemplateSelectionModal({ onClose, onSelect, user }) {
  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Clean, traditional, and ATS-friendly. Perfect for corporate roles.',
      isFree: true,
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Bold sidebar and profile photo support. Great for creatives and tech.',
      isFree: true,
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Elegant layout for seasoned professionals. Stand out with style.',
      isFree: false,
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.75rem' }}>Choose a Template</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>
          Select a starting layout for your new resume. You can always change this later.
        </p>

        <div className="template-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {templates.map((tpl) => {
            const isLocked = !tpl.isFree && !user?.is_upgraded;

            return (
              <div 
                key={tpl.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.8 : 1,
                  position: 'relative',
                  border: '2px solid var(--border-subtle)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                }}
                onMouseOver={(e) => { 
                  if (!isLocked) {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
                onMouseOut={(e) => { 
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  if (!isLocked) {
                    onSelect(tpl.id);
                  }
                }}
              >
                {/* Live Preview Container */}
                <div style={{ 
                  width: '100%', 
                  height: '340px',
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  paddingTop: '1rem'
                }}>
                  <div style={{
                    width: '100%',
                    flexShrink: 0,
                    pointerEvents: 'none',
                    marginTop: '1.25rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}>
                    <ResumePreview templateId={tpl.id} data={DUMMY_DATA} />
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{tpl.name}</h3>
                    {tpl.isFree ? (
                      <span className="badge badge-free">Free</span>
                    ) : (
                      <span className="badge badge-premium">Premium</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {tpl.description}
                  </p>
                </div>

                {isLocked && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    borderRadius: 'inherit'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" style={{ marginBottom: '0.5rem' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Pro Only</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .modal-content {
              padding: 1.25rem !important;
              max-height: 90vh;
              overflow-y: auto;
            }
            h2 {
              font-size: 1.25rem !important;
            }
            .template-grid {
              gap: 1rem !important;
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
