'use client';

import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import '@/styles/templates.css';

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
};

export default function ResumePreview({ data, templateId = 'classic' }) {
  const Template = templates[templateId] || ClassicTemplate;

  return (
    <div className="resume-preview-wrapper">
      <Template data={data} />

      <style jsx>{`
        .resume-preview-wrapper {
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
}
