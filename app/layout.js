import './globals.css';

export const metadata = {
  title: 'ResumeForge - AI-Powered Resume Builder',
  description: 'Create stunning, professional resumes with AI assistance. Choose from beautiful templates, generate content with AI, and download as PDF.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
