import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

// ── METADATA ───────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Christ Restoration Centre',
    template: '%s — CRC',
  },
  description:
    'Stay connected with Christ Restoration Centre. Access announcements, giving, gallery, and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CRC',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png',   sizes: '32x32',   type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    // Microsoft tile
    'msapplication-TileColor': '#050506',
    'msapplication-TileImage': '/icons/icon-144x144.png',
  },
};

// ── VIEWPORT ───────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#050506' },
    { media: '(prefers-color-scheme: light)', color: '#050506' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',  // respects iPhone notch / home indicator
};

// ── LAYOUT ─────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ServiceWorkerRegistration />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
