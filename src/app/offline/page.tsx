import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "You're Offline — Christ Restoration Centre",
};

export default function OfflinePage() {
  return (
    <main
      className="cinema-bg min-h-screen flex flex-col items-center justify-center px-6 text-center"
      aria-labelledby="offline-heading"
    >
      {/* Cross icon */}
      <div
        className="relative w-12 h-14 mb-7"
        aria-hidden="true"
      >
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 w-2.5 h-full rounded-full"
          style={{ background: '#D4AF37' }}
        />
        <span
          className="absolute top-[30%] left-0 w-full h-2.5 rounded-full"
          style={{ background: '#D4AF37' }}
        />
      </div>

      <h1
        id="offline-heading"
        className="font-cinzel text-2xl font-bold gold-text mb-3"
      >
        You&rsquo;re Offline
      </h1>

      <p
        className="text-sm leading-relaxed max-w-xs mb-8"
        style={{ color: 'rgba(138,143,152,0.85)' }}
      >
        Check your internet connection and try again. Pages you&rsquo;ve already
        visited will still be available.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {/* Reload button — client-side only, gracefully degrades */}
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
            color: '#020203',
            boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
          }}
        >
          Try Again
        </button>

        <Link
          href="/"
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#EDEDEF',
          }}
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
