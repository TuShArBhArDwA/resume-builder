import './globals.css';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CVFlow - Professional Resume Builder',
  description: 'Create stunning, professional resumes with modern templates and download as PDF.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
