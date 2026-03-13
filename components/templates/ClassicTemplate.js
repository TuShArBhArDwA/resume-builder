export default function ClassicTemplate({ data }) {
  const { personal_info = {}, summary = '', experience = [], education = [], skills = [] } = data || {};

  return (
    <div className="resume-classic">
      {/* Header */}
      <div className="classic-header">
        <h1 className="classic-name">{personal_info.name || 'Your Name'}</h1>
        <p className="classic-title">{personal_info.title || 'Professional Title'}</p>
        <div className="classic-contact">
          {personal_info.email && <span>{personal_info.email}</span>}
          {personal_info.phone && <span>{personal_info.phone}</span>}
          {personal_info.location && <span>{personal_info.location}</span>}
          {personal_info.linkedin && <span>{personal_info.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="classic-section">
          <h2 className="classic-section-title">Professional Summary</h2>
          <div className="classic-divider"></div>
          <p className="classic-text">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="classic-section">
          <h2 className="classic-section-title">Work Experience</h2>
          <div className="classic-divider"></div>
          {experience.map((exp, i) => (
            <div key={i} className="classic-entry">
              <div className="classic-entry-header">
                <div>
                  <h3 className="classic-entry-title">{exp.title || 'Job Title'}</h3>
                  <p className="classic-entry-company">{exp.company || 'Company Name'}</p>
                </div>
                <span className="classic-entry-date">
                  {exp.startDate || 'Start'} — {exp.endDate || 'Present'}
                </span>
              </div>
              {exp.description && (
                <p className="classic-text classic-entry-desc">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="classic-section">
          <h2 className="classic-section-title">Education</h2>
          <div className="classic-divider"></div>
          {education.map((edu, i) => (
            <div key={i} className="classic-entry">
              <div className="classic-entry-header">
                <div>
                  <h3 className="classic-entry-title">{edu.degree || 'Degree'}</h3>
                  <p className="classic-entry-company">{edu.school || 'School Name'}</p>
                </div>
                <span className="classic-entry-date">
                  {edu.startDate || 'Start'} — {edu.endDate || 'End'}
                </span>
              </div>
              {edu.description && (
                <p className="classic-text classic-entry-desc">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="classic-section">
          <h2 className="classic-section-title">Skills</h2>
          <div className="classic-divider"></div>
          <div className="classic-skills">
            {skills.map((skill, i) => (
              <span key={i} className="classic-skill">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
