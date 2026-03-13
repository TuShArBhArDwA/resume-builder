export default function ModernTemplate({ data }) {
  const { personal_info = {}, summary = '', experience = [], education = [], skills = [], custom_sections = [] } = data || {};

  return (
    <div className="resume-modern">
      {/* Sidebar */}
      <div className="modern-sidebar">
        <div className="modern-avatar">
          {(personal_info.name || 'U').charAt(0).toUpperCase()}
        </div>
        <h1 className="modern-name">{personal_info.name || 'Your Name'}</h1>
        <p className="modern-title">{personal_info.title || 'Professional Title'}</p>

        {/* Contact */}
        <div className="modern-sidebar-section">
          <h3 className="modern-sidebar-heading">Contact</h3>
          {personal_info.email && (
            <div className="modern-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{personal_info.email}</span>
            </div>
          )}
          {personal_info.phone && (
            <div className="modern-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{personal_info.phone}</span>
            </div>
          )}
          {personal_info.location && (
            <div className="modern-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{personal_info.location}</span>
            </div>
          )}
          {personal_info.linkedin && (
            <div className="modern-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{personal_info.linkedin}</span>
            </div>
          )}
        </div>

        {/* Skills in Sidebar */}
        {skills.length > 0 && (
          <div className="modern-sidebar-section">
            <h3 className="modern-sidebar-heading">Skills</h3>
            <div className="modern-skills">
              {skills.map((skill, i) => (
                <span key={i} className="modern-skill">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="modern-main">
        {/* Summary */}
        {summary && (
          <div className="modern-section">
            <h2 className="modern-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              About
            </h2>
            <p className="modern-text">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="modern-section">
            <h2 className="modern-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="modern-entry">
                <div className="modern-entry-dot"></div>
                <div className="modern-entry-content">
                  <h3>{exp.title || 'Job Title'}</h3>
                  <p className="modern-entry-meta">
                    {exp.company || 'Company'} · {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                  </p>
                  {exp.description && <p className="modern-text">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="modern-section">
            <h2 className="modern-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 10 3 12 0v-5" />
              </svg>
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="modern-entry">
                <div className="modern-entry-dot"></div>
                <div className="modern-entry-content">
                  <h3>{edu.degree || 'Degree'}</h3>
                  <p className="modern-entry-meta">
                    {edu.school || 'School'} · {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                  </p>
                  {edu.description && <p className="modern-text">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {custom_sections?.map((sec, i) => (
          <div key={i} className="modern-section">
            <h2 className="modern-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {sec.title}
            </h2>
            <p className="modern-text" style={{ whiteSpace: 'pre-wrap' }}>{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
