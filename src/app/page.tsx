'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InstallButton } from '@/components/InstallButton';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Announcement, AppSettings } from '@/types';
import { BookOpen, Heart, Calendar, ChevronRight, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    href: '/pastors-corner',
    icon: BookOpen,
    label: "Pastor's Corner",
    desc: 'Messages & devotions',
    accent: 'rgba(212,175,55,0.18)',
    border: 'rgba(212,175,55,0.28)',
  },
  {
    href: '/youth',
    icon: Heart,
    label: 'Youth',
    desc: 'Connect & grow',
    accent: 'rgba(0,255,136,0.1)',
    border: 'rgba(0,255,136,0.22)',
  },
  {
    href: '/sunday-school',
    icon: Calendar,
    label: 'Sunday School',
    desc: 'Learn & explore',
    accent: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.28)',
  },
  {
    href: '/gallery',
    icon: ImageIcon,
    label: 'Gallery',
    desc: 'Moments & memories',
    accent: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.22)',
  },
];

function HomeSkeleton() {
  return (
    <div className="home-bg min-h-screen pb-28 animate-pulse">
      <div className="px-5 pt-14 pb-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/10" />
        <div className="h-6 w-48 rounded-lg bg-white/10" />
        <div className="h-4 w-32 rounded-lg bg-white/10" />
      </div>
      <div className="px-5 space-y-3">
        <div className="h-24 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5" />)}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [verseOfDay, setVerseOfDay] = useState('The Lord is my shepherd, I shall not want. — Psalm 23:1');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'globalAnnouncements'), orderBy('date', 'desc'), limit(3));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({
        id: d.id, ...d.data(),
        date: d.data().date?.toDate(),
        createdAt: d.data().createdAt?.toDate(),
      })) as Announcement[];
      setAnnouncements(data);

      const settingsDoc = await getDoc(doc(db, 'appSettings', 'main'));
      if (settingsDoc.exists()) {
        const s = settingsDoc.data() as AppSettings;
        if (s.verseOfTheDay) setVerseOfDay(s.verseOfTheDay);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <HomeSkeleton />;

  return (
    <main className="home-bg page-transition pb-28" id="main-content">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-purple-700 focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>

      {/* ── Hero ─────────────────────────────────────── */}
      <header className="home-hero-glow relative px-6 pt-14 pb-8 text-center overflow-hidden">
        {/* decorative stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.35 + 0.08,
              }}
            />
          ))}
        </div>

        {/* Cross emblem */}
        <div className="relative z-10 flex justify-center mb-5" aria-hidden="true">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(212,175,55,0.35)' }}
          >
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
              <rect x="11" y="0" width="6" height="36" rx="3" fill="#D4AF37" />
              <rect x="0" y="10" width="28" height="6" rx="3" fill="#D4AF37" />
            </svg>
          </div>
        </div>

        <h1 className="font-cinzel text-2xl font-bold gold-text relative z-10 leading-tight mb-1">
          Christ Restoration Centre
        </h1>
        <p
          className="font-cormorant text-base italic relative z-10 mb-6"
          style={{ color: 'rgba(196,181,253,0.8)' }}
        >
          Welcome to our community
        </p>
        <div className="relative z-10">
          <InstallButton />
        </div>
      </header>

      {/* ── Verse of the Day ─────────────────────────── */}
      <section className="px-5 mb-5" aria-label="Verse of the Day">
        <div className="verse-card">
          <p
            className="text-[10px] font-semibold tracking-[2px] uppercase mb-3"
            style={{ color: 'rgba(212,175,55,0.7)' }}
          >
            Verse of the Day
          </p>
          <blockquote
            className="font-cormorant text-lg italic leading-relaxed"
            style={{ color: '#F5F0FF' }}
          >
            &ldquo;{verseOfDay}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── Quick Links ───────────────────────────────── */}
      <section className="px-5 mb-5" aria-label="Quick access">
        <p
          className="font-cinzel text-xs tracking-[2px] uppercase mb-3"
          style={{ color: 'rgba(167,139,250,0.6)' }}
        >
          Explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ href, icon: Icon, label, desc, accent, border }) => (
            <Link
              key={href}
              href={href}
              className="block p-4 rounded-2xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
              style={{ background: accent, border: `1px solid ${border}` }}
            >
              <Icon size={20} className="mb-2" style={{ color: '#D4AF37' }} aria-hidden="true" />
              <p className="font-semibold text-sm mb-0.5" style={{ color: '#F5F0FF' }}>
                {label}
              </p>
              <p className="text-[11px]" style={{ color: 'rgba(196,181,253,0.6)' }}>
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────── */}
      {announcements.length > 0 && (
        <section className="px-5 mb-5" aria-label="Upcoming events">
          <div className="flex items-center justify-between mb-3">
            <p
              className="font-cinzel text-xs tracking-[2px] uppercase"
              style={{ color: 'rgba(167,139,250,0.6)' }}
            >
              Upcoming Events
            </p>
            <Link
              href="/announcements"
              className="flex items-center gap-1 text-[11px] rounded focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none px-1"
              style={{ color: 'rgba(212,175,55,0.75)' }}
            >
              See all <ChevronRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map(a => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </section>
      )}

      {/* ── Give & Support CTA ───────────────────────── */}
      <section className="px-5 mb-5" aria-label="Give and support">
        <Link
          href="/giving"
          className="block p-5 rounded-2xl text-center transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(124,58,237,0.1))',
            border: '1px solid rgba(212,175,55,0.28)',
          }}
        >
          <p className="gold-text font-cinzel text-base font-bold mb-1">Give &amp; Support</p>
          <p className="text-[12px]" style={{ color: 'rgba(196,181,253,0.75)' }}>
            Sow into the Kingdom — every gift makes a difference
          </p>
        </Link>
      </section>
    </main>
  );
}
