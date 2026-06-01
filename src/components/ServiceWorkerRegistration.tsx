'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker.
 * Drop this component into your root layout once:
 *   <ServiceWorkerRegistration />
 */
export const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        // Check for updates every time the app gains focus
        const handleVisibility = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Optional: notify user when a new version is available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // A new version is ready — you can show a toast here if desired
              console.info('[CRC SW] New version available. Reload to update.');
            }
          });
        });
      } catch (err) {
        console.error('[CRC SW] Registration failed:', err);
      }
    };

    // Defer registration until after first paint
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
};
