// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';

export const viewport: Viewport = {
  themeColor: '#0D5C63',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Christ Restoration Centre',
  description: 'Official mobile app for Christ Restoration Centre',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CRC',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen pb-20">
              {children}
            </div>
            <BottomNav />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
