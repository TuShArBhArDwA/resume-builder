'use client';

import { useEffect, useRef, useState } from 'react';
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
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parentWidth = containerRef.current.parentElement.clientWidth;
        const targetWidth = 794;
        
        if (parentWidth < targetWidth) {
          setScale(parentWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    // Also use ResizeObserver for more reliable parent-based scaling
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="resume-preview-outer-container" style={{
      width: '100%',
      height: `${1123 * scale}px`,
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div 
        className="resume-preview-wrapper" 
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <Template data={data} />

        <style jsx>{`
          .resume-preview-wrapper {
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
            transform-origin: top center;
            width: 794px;
            height: 1123px;
            flex-shrink: 0;
          }
        `}</style>
      </div>
    </div>
  );
}
