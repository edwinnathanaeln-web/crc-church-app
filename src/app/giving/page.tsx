// src/app/giving/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { Heart, ExternalLink } from 'lucide-react';

export default function Giving() {
  const { setTheme } = useTheme();
  const [givingUrl, setGivingUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('home');
    fetchGivingInfo();
  }, [setTheme]);

  const fetchGivingInfo = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'appSettings', 'main'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setGivingUrl(data.givingUrl || '');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching giving info:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart size={64} className="mx-auto mb-4" style={{ color: 'var(--accent-color)' }} />
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--accent-color)' }}>
            Give to God's Work
          </h1>
          <p className="text-lg opacity-90">
            Your generosity helps us spread the Gospel and serve our community.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg backdrop-blur-sm mb-6"
             style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
          <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="opacity-75">Bank Name:</span>
              <span className="font-semibold">First National Bank</span>
            </div>
            <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="opacity-75">Account Name:</span>
              <span className="font-semibold">Christ Restoration Centre</span>
            </div>
            <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="opacity-75">Account Number:</span>
              <span className="font-semibold">123456789</span>
            </div>
            <div className="flex justify-between p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="opacity-75">Branch Code:</span>
              <span className="font-semibold">250655</span>
            </div>
          </div>
        </div>

        {givingUrl && (
          <a
            href={givingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--bg-color)',
            }}
          >
            Give Online
            <ExternalLink size={20} />
          </a>
        )}

        <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
          <p className="text-center italic opacity-90">
            &ldquo;Each of you should give what you have decided in your heart to give, 
            not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </p>
          <p className="text-center mt-2 text-sm" style={{ color: 'var(--accent-color)' }}>
            - 2 Corinthians 9:7
          </p>
        </div>
      </div>
    </div>
  );
}
