'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ResumePreview from '@/components/ResumePreview';
import AIAssistButton from '@/components/AIAssistButton';
import UpgradeModal from '@/components/UpgradeModal';
import './editor.css';

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const previewRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Main resume state - initialized with empty fields
  const [resume, setResume] = useState({
    title: 'Untitled Resume',
    template_id: 'classic',
    personal_info: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', photoUrl: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    custom_sections: [],
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(stored));
    fetchResume();
  }, [id, router]);

  // Fetch existing resume data from Supabase on mount
  const fetchResume = async () => {
    try {
      const res = await fetch(`/api/resumes/${id}`);
      const data = await res.json();
      if (data.resume) {
        // Merge data to ensure all keys exist (prevents controlled/uncontrolled input warnings)
        setResume({
          ...data.resume,
          personal_info: data.resume.personal_info || {},
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          skills: data.resume.skills || [],
          custom_sections: data.resume.personal_info?.custom_sections || [],
        });
      }
    } catch (err) {
      showToast('Failed to load resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resume.title,
          template_id: resume.template_id,
          personal_info: {
            ...resume.personal_info,
            custom_sections: resume.custom_sections
          },
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
        }),
      });
      const data = await res.json();
      if (data.resume) {
        showToast('Resume saved!');
      }
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Client-side PDF generation using html2pdf.js
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current;
      if (!element) return;

      // PDF options for high quality A4 layout
      const opt = {
        margin: [0, 0, -1, 0], // Tiny negative bottom margin to force single page if borderline
        filename: `${resume.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          scrollY: 0, // Ensure we capture from the top
          windowWidth: document.documentElement.offsetWidth // Force consistent width
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      showToast('PDF generated! Save it to your device.');
    } catch (err) {
      showToast('Download failed', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value },
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp),
    }));
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu),
    }));
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill) => {
    if (skill && !resume.skills.includes(skill)) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const removeSkill = (index) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addCustomSection = () => {
    setResume((prev) => ({
      ...prev,
      custom_sections: [...(prev.custom_sections || []), { title: '', content: '' }],
    }));
  };

  const updateCustomSection = (index, field, value) => {
    setResume((prev) => ({
      ...prev,
      custom_sections: prev.custom_sections.map((sec, i) => i === index ? { ...sec, [field]: value } : sec),
    }));
  };

  const removeCustomSection = (index) => {
    setResume((prev) => ({
      ...prev,
      custom_sections: prev.custom_sections.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      alert('Photo upload is currently unavailable. Please try again later or contact support.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        updatePersonalInfo('photoUrl', data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(e.target.value.trim());
      e.target.value = '';
    }
  };

  const selectTemplate = (templateId) => {
    if (templateId === 'executive' && user && !user.is_upgraded) {
      setShowUpgrade(true);
      return;
    }
    setResume((prev) => ({ ...prev, template_id: templateId }));
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
        setResume((prev) => ({ ...prev, template_id: 'executive' }));
        setShowUpgrade(false);
        showToast('🎉 Upgraded to Pro! Executive template unlocked.');
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
    { id: 'classic', name: 'Classic', free: true },
    { id: 'modern', name: 'Modern', free: true },
    { id: 'executive', name: 'Executive', free: false },
  ];

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner" style={{ width: 32, height: 32 }}></div>
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <Navbar />

      {/* Top Bar */}
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <input
            type="text"
            className="editor-title-input"
            value={resume.title}
            onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Resume Title"
          />
        </div>

        <div className="editor-topbar-center">
          {templates.map((t) => (
            <button
              key={t.id}
              className={`template-tab ${resume.template_id === t.id ? 'active' : ''} ${!t.free && !user?.is_upgraded ? 'locked' : ''}`}
              onClick={() => selectTemplate(t.id)}
            >
              {!t.free && !user?.is_upgraded && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--accent-gold)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
              {t.name}
            </button>
          ))}
        </div>

        <div className="editor-topbar-right">
          <button className="btn btn-secondary btn-sm" onClick={saveResume} disabled={saving}>
            {saving ? <div className="spinner" style={{ width: 14, height: 14 }}></div> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            )}
            Save
          </button>
          <button className="btn btn-primary btn-sm" onClick={downloadPDF} disabled={downloading}>
            {downloading ? <div className="spinner" style={{ width: 14, height: 14 }}></div> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="editor-split">
        {/* Left: Form */}
        <div className="editor-form">
          {/* Personal Info */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Personal Information
              </h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={resume.personal_info.name || ''} onChange={(e) => updatePersonalInfo('name', e.target.value)} placeholder="Tushar Bhardwaj" />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" value={resume.personal_info.title || ''} onChange={(e) => updatePersonalInfo('title', e.target.value)} placeholder="Software Engineer" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={resume.personal_info.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="tusharbhardwaj2617@gmail.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={resume.personal_info.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+91 7009343545" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={resume.personal_info.location || ''} onChange={(e) => updatePersonalInfo('location', e.target.value)} placeholder="Haryana, India" />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input className="form-input" value={resume.personal_info.linkedin || ''} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/bhardwajtushar2004" />
              </div>
              {resume.template_id === 'modern' && (
                <div className="form-group">
                  <label className="form-label">Profile Photo</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label className={`btn btn-primary ${isUploading ? 'loading' : ''}`} style={{ cursor: 'pointer', margin: 0 }}>
                      {isUploading ? 'Uploading...' : (resume.personal_info.photoUrl ? 'Change Photo' : 'Upload Photo')}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {resume.personal_info.photoUrl && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => updatePersonalInfo('photoUrl', '')}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {resume.personal_info.photoUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={resume.personal_info.photoUrl} alt="Profile" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="17" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="17" y1="18" x2="3" y2="18" />
                </svg>
                Professional Summary
              </h3>
              <AIAssistButton
                type="summary"
                context={{
                  name: resume.personal_info.name,
                  title: resume.personal_info.title,
                  experience: resume.experience.map(e => `${e.title} at ${e.company}`).join(', '),
                  skills: resume.skills.join(', '),
                }}
                onResult={(result) => setResume((prev) => ({ ...prev, summary: result }))}
              />
            </div>
            <textarea
              className="form-textarea"
              value={resume.summary}
              onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a brief professional summary..."
              rows={4}
            />
          </div>

          {/* Experience */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Work Experience
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={addExperience}>+ Add</button>
            </div>

            {resume.experience.map((exp, i) => (
              <div key={i} className="form-entry">
                <div className="form-entry-header">
                  <span className="form-entry-num">#{i + 1}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <AIAssistButton
                      type="experience"
                      context={{
                        description: exp.description,
                        jobTitle: exp.title,
                        company: exp.company,
                      }}
                      onResult={(result) => updateExperience(i, 'description', result)}
                    />
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeExperience(i)} title="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input className="form-input" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} placeholder="Software Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Google" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} placeholder="Jan 2022" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} placeholder="Present" />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} />
                </div>
              </div>
            ))}

            {resume.experience.length === 0 && (
              <p className="form-empty">No experience added yet. Click &quot;+ Add&quot; to get started.</p>
            )}
          </div>

          {/* Education */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 10 3 12 0v-5" />
                </svg>
                Education
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={addEducation}>+ Add</button>
            </div>

            {resume.education.map((edu, i) => (
              <div key={i} className="form-entry">
                <div className="form-entry-header">
                  <span className="form-entry-num">#{i + 1}</span>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeEducation(i)} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input className="form-input" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="B.S. Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">School</label>
                    <input className="form-input" value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} placeholder="MIT" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} placeholder="Sep 2018" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} placeholder="May 2022" />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Description (Optional)</label>
                  <textarea className="form-textarea" value={edu.description || ''} onChange={(e) => updateEducation(i, 'description', e.target.value)} placeholder="Relevant coursework, honors..." rows={2} />
                </div>
              </div>
            ))}

            {resume.education.length === 0 && (
              <p className="form-empty">No education added yet. Click &quot;+ Add&quot; to get started.</p>
            )}
          </div>

          {/* Skills */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Skills
              </h3>
              <AIAssistButton
                type="skills"
                context={{
                  title: resume.personal_info.title,
                  industry: '',
                  experience: resume.experience.map(e => e.title).join(', '),
                }}
                onResult={(result) => {
                  const newSkills = result.split(',').map(s => s.trim()).filter(s => s);
                  setResume((prev) => ({
                    ...prev,
                    skills: [...new Set([...prev.skills, ...newSkills])],
                  }));
                }}
              />
            </div>

            <div className="skills-input-row">
              <input
                className="form-input"
                placeholder="Type a skill and press Enter"
                onKeyDown={handleSkillKeyDown}
              />
            </div>

            <div className="skills-tags">
              {resume.skills.map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="skill-remove">×</button>
                </span>
              ))}
            </div>

            {resume.skills.length === 0 && (
              <p className="form-empty">No skills added yet. Type and press Enter, or use AI to suggest skills.</p>
            )}
          </div>

          {/* Custom Sections */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Custom Sections
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={addCustomSection}>+ Add Section</button>
            </div>

            {resume.custom_sections?.map((sec, i) => (
              <div key={i} className="form-entry">
                <div className="form-entry-header">
                  <input
                    className="form-input"
                    style={{ flex: 1, marginRight: '1rem', fontWeight: 'bold' }}
                    value={sec.title}
                    onChange={(e) => updateCustomSection(i, 'title', e.target.value)}
                    placeholder="Section Title (e.g. Projects)"
                  />
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeCustomSection(i)} title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <textarea
                    className="form-textarea"
                    value={sec.content}
                    onChange={(e) => updateCustomSection(i, 'content', e.target.value)}
                    placeholder="Describe your content here..."
                    rows={4}
                  />
                </div>
              </div>
            ))}

            {(!resume.custom_sections || resume.custom_sections.length === 0) && (
              <p className="form-empty">Add extra sections like Projects, Awards, or Languages.</p>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="editor-preview">
          <div className="editor-preview-container" ref={previewRef}>
            <ResumePreview data={resume} templateId={resume.template_id} />
          </div>
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
