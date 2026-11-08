import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'ZenCro — K-12 School Management System',
  description: 'Production-ready School Management SaaS platform engineered for Indian K-12 institutions (CBSE, ICSE, and State Boards).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col selection:bg-blue-600 selection:text-white" style={{ backgroundColor: 'var(--zc-bg)', color: 'var(--zc-text)' }}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
