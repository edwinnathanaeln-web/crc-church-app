'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const bankDetails = [
  { label: 'Bank Name',       value: 'First National Bank' },
  { label: 'Account Name',    value: 'Christ Restoration Centre' },
  { label: 'Account Number',  value: '123456789' },
  { label: 'Branch Code',     value: '250655' },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : `Copy ${value}`}
      className="p-1.5 rounded-lg transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
      style={{ color: copied ? '#22c55e' : 'rgba(212,175,55,0.7)' }}
    >
      {copied ? <CheckCircle2 size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
    </button>
  );
}

export default function Giving() {
  const [givingUrl, setGivingUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'appSettings', 'main'));
        if (snap.exists()) setGivingUrl(snap.data().givingUrl || '');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="home-bg min-h-screen flex items-center justify-center">
        <div className="loading-spinner" role="status" aria-label="Loading giving information" />
      </div>
    );
  }

  return (
    <main className="home-bg page-transition min-h-screen pb-28 px-5">
      <div className="max-w-lg mx-auto pt-10">

        {/* Header */}
        <header className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
          >
            <Heart size={28} style={{ color: '#D4AF37' }} aria-hidden="true" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold gold-text mb-2">
            Give to God&rsquo;s Work
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.8)' }}>
            Your generosity helps us spread the Gospel and serve our community.
          </p>
        </header>

        {/* Bank Details card */}
        <section
          aria-label="Bank details"
          className="rounded-2xl p-5 mb-5"
          style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(167,139,250,0.2)',
          }}
        >
          <h2 className="font-cinzel text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#D4AF37' }}>
            Bank Details
          </h2>
          <dl className="space-y-2">
            {bankDetails.map(({ label, value }) => (
              <div key={label} className="giving-bank-row">
                <dt className="text-xs shrink-0" style={{ color: 'rgba(196,181,253,0.55)' }}>{label}</dt>
                <div className="flex items-center gap-2 ml-auto">
                  <dd className="text-sm font-semibold" style={{ color: '#F5F0FF' }}>{value}</dd>
                  <CopyButton value={value} />
                </div>
              </div>
            ))}
          </dl>
        </section>

        {/* Online giving CTA */}
        {givingUrl && (
          <a
            href={givingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none mb-5"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
              color: '#0f0520',
              boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
            }}
          >
            Give Online
            <ExternalLink size={18} aria-hidden="true" />
          </a>
        )}

        {/* Scripture */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <blockquote className="text-center font-cormorant text-lg italic leading-relaxed mb-2" style={{ color: '#F5F0FF' }}>
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver.&rdquo;
          </blockquote>
          <cite className="block text-center text-sm not-italic" style={{ color: 'rgba(212,175,55,0.75)' }}>
            — 2 Corinthians 9:7
          </cite>
        </div>

      </div>
    </main>
  );
}
