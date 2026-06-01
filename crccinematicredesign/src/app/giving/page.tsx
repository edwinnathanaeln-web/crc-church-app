'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const bankDetails = [
  { label: 'Bank Name',       value: 'First National Bank'        },
  { label: 'Account Name',    value: 'Christ Restoration Centre'  },
  { label: 'Account Number',  value: '123456789'                  },
  { label: 'Branch Code',     value: '250655'                     },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : `Copy ${value}`}
      className="p-1.5 rounded-lg transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
      style={{ color: copied ? '#22c55e' : 'rgba(212,175,55,0.6)' }}
    >
      {copied
        ? <CheckCircle2 size={14} aria-hidden="true" />
        : <Copy size={14} aria-hidden="true" />
      }
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
      <div className="cinema-bg min-h-screen flex items-center justify-center">
        <div className="loading-spinner" role="status" aria-label="Loading giving information" />
      </div>
    );
  }

  return (
    <main className="cinema-bg page-transition min-h-screen pb-28 px-5">
      <div className="max-w-lg mx-auto pt-10">

        {/* Header */}
        <header className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 30px rgba(212,175,55,0.1)',
            }}
          >
            <Heart size={26} style={{ color: '#D4AF37' }} aria-hidden="true" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold gold-text mb-2">
            Give to God&rsquo;s Work
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(138,143,152,0.9)' }}>
            Your generosity helps us spread the Gospel and serve our community.
          </p>
        </header>

        {/* Bank Details */}
        <section
          aria-label="Bank details"
          className="rounded-2xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <span
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }}
            aria-hidden="true"
          />
          <h2 className="font-cinzel text-xs font-semibold tracking-[3px] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.7)' }}>
            Bank Details
          </h2>
          <dl className="space-y-2">
            {bankDetails.map(({ label, value }) => (
              <div key={label} className="giving-bank-row">
                <dt className="text-xs shrink-0" style={{ color: 'rgba(138,143,152,0.7)' }}>{label}</dt>
                <div className="flex items-center gap-2 ml-auto">
                  <dd className="text-sm font-medium" style={{ color: '#EDEDEF' }}>{value}</dd>
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
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:outline-none mb-4"
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
              color: '#020203',
              boxShadow: '0 4px 24px rgba(212,175,55,0.25)',
            }}
          >
            Give Online
            <ExternalLink size={17} aria-hidden="true" />
          </a>
        )}

        {/* Scripture */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(212,175,55,0.05)',
            border: '1px solid rgba(212,175,55,0.15)',
          }}
        >
          <span
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
            aria-hidden="true"
          />
          <blockquote className="text-center font-cormorant text-lg italic leading-relaxed mb-2" style={{ color: '#EDEDEF' }}>
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly
            or under compulsion, for God loves a cheerful giver.&rdquo;
          </blockquote>
          <cite className="block text-center text-sm not-italic" style={{ color: 'rgba(212,175,55,0.6)' }}>
            — 2 Corinthians 9:7
          </cite>
        </div>

      </div>
    </main>
  );
}
