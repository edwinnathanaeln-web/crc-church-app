'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled]       = useState(false);
  const [isIOS, setIsIOS]                   = useState(false);
  const [showIOSHint, setShowIOSHint]       = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // iOS Safari detection
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Android / Chrome prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect when user installs
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHint(prev => !prev);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // Already installed — show nothing
  if (isInstalled) return null;

  // Neither Android prompt nor iOS — hide button
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleInstall}
        aria-label="Install CRC app"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:outline-none"
        style={{
          background: 'rgba(212,175,55,0.12)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: '#D4AF37',
          boxShadow: '0 0 20px rgba(212,175,55,0.08)',
        }}
      >
        <Download size={15} aria-hidden="true" />
        Install App
      </button>

      {/* iOS share-sheet hint */}
      {isIOS && showIOSHint && (
        <p
          className="text-xs text-center max-w-[220px] leading-relaxed animate-fade-in"
          style={{ color: 'rgba(212,175,55,0.7)' }}
          role="status"
        >
          Tap the <strong style={{ color: '#D4AF37' }}>Share</strong> button in Safari, then
          &ldquo;<strong style={{ color: '#D4AF37' }}>Add to Home Screen</strong>&rdquo;
        </p>
      )}
    </div>
  );
};
