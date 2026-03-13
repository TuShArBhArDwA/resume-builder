export default function ExecutiveTemplate({ data }) {
  const { personal_info = {}, summary = '', experience = [], education = [], skills = [], custom_sections = [] } = data || {};

  return (
    <div className="resume-executive">
      {/* Header */}
      <div className="exec-header">
        <div className="exec-header-accent"></div>
        <div className="exec-header-content">
          <h1 className="exec-name">{personal_info.name || 'Your Name'}</h1>
          <p className="exec-title">{personal_info.title || 'Professional Title'}</p>
          <div className="exec-contact">
            {personal_info.email && (
              <span className="exec-contact-item">{personal_info.email}</span>
            )}
            {personal_info.phone && (
              <span className="exec-contact-item">{personal_info.phone}</span>
            )}
            {personal_info.location && (
              <span className="exec-contact-item">{personal_info.location}</span>
            )}
            {personal_info.linkedin && (
              <span className="exec-contact-item">{personal_info.linkedin}</span>
            )}
          </div>
        </div>
      </div>

      <div className="exec-body">
        {/* Summary */}
        {summary && (
          <div className="exec-section">
            <div className="exec-section-label">EXECUTIVE SUMMARY</div>
            <p className="exec-text exec-summary-text">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="exec-section">
            <div className="exec-section-label">PROFESSIONAL EXPERIENCE</div>
            {experience.map((exp, i) => (
              <div key={i} className="exec-entry">
                <div className="exec-entry-top">
                  <div>
                    <h3 className="exec-entry-title">{exp.title || 'Job Title'}</h3>
                    <p className="exec-entry-company">{exp.company || 'Company Name'}</p>
                  </div>
                  <div className="exec-entry-date">
                    {exp.startDate || 'Start'} — {exp.endDate || 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <p className="exec-text">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="exec-two-col">
          {/* Education */}
          {education.length > 0 && (
            <div className="exec-section">
              <div className="exec-section-label">EDUCATION</div>
              {education.map((edu, i) => (
                <div key={i} className="exec-entry">
                  <h3 className="exec-entry-title">{edu.degree || 'Degree'}</h3>
                  <p className="exec-entry-company">{edu.school || 'School Name'}</p>
                  <p className="exec-entry-date-inline">
                    {edu.startDate || 'Start'} — {edu.endDate || 'End'}
                  </p>
                  {edu.description && <p className="exec-text">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="exec-section">
              <div className="exec-section-label">CORE COMPETENCIES</div>
              <div className="exec-skills">
                {skills.map((skill, i) => (
                  <div key={i} className="exec-skill">
                    <div className="exec-skill-dot"></div>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Sections */}
        {custom_sections?.map((sec, i) => (
          <div key={i} className="exec-section">
            <div className="exec-section-label">{sec.title?.toUpperCase() || 'CUSTOM SECTION'}</div>
            <p className="exec-text" style={{ whiteSpace: 'pre-wrap' }}>{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
