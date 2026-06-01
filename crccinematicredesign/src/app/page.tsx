'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InstallButton } from '@/components/InstallButton';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Announcement, AppSettings } from '@/types';
import { BookOpen, Heart, Calendar, ChevronRight, Image as ImageIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  {
    href: '/pastors-corner',
    icon: BookOpen,
    label: "Pastor's Corner",
    desc: 'Messages & devotions',
    glow: 'rgba(212,175,55,0.1)',
    border: 'rgba(212,175,55,0.2)',
    iconColor: '#D4AF37',
  },
  {
    href: '/youth',
    icon: Heart,
    label: 'Youth',
    desc: 'Connect & grow',
    glow: 'rgba(0,255,136,0.06)',
    border: 'rgba(0,255,136,0.18)',
    iconColor: '#00FF88',
  },
  {
    href: '/sunday-school',
    icon: Calendar,
    label: 'Sunday School',
    desc: 'Learn & explore',
    glow: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.18)',
    iconColor: '#F97316',
  },
  {
    href: '/gallery',
    icon: ImageIcon,
    label: 'Gallery',
    desc: 'Moments & memories',
    glow: 'rgba(124,58,237,0.08)',
    border: 'rgba(167,139,250,0.2)',
    iconColor: '#A78BFA',
  },
];

function HomeSkeleton() {
  return (
    <div className="cinema-bg min-h-screen pb-28">
      <div className="px-5 pt-16 pb-10 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl shimmer" />
        <div className="h-7 w-52 rounded-lg shimmer" />
        <div className="h-4 w-36 rounded-lg shimmer" />
      </div>
      <div className="px-5 space-y-4">
        <div className="h-28 rounded-2xl shimmer" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
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
    <main className="cinema-bg page-transition pb-28" id="main-content">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-purple-900 focus:text-white focus:text-sm"
      >
        Skip to main content
      </a>

      {/* Hero */}
      <header className="home-hero-glow relative px-6 pt-16 pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 1.5 + 0.5,
                height: Math.random() * 1.5 + 0.5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.05,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex justify-center mb-6" aria-hidden="true">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 40px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <svg width="32" height="40" viewBox="0 0 28 36" fill="none" aria-hidden="true">
              <rect x="11" y="0" width="6" height="36" rx="3" fill="#D4AF37" />
              <rect x="0" y="10" width="28" height="6" rx="3" fill="#D4AF37" />
            </svg>
          </div>
        </div>

        <h1 className="font-cinzel text-3xl font-bold gold-text relative z-10 leading-tight mb-2 tracking-wide">
          Christ Restoration Centre
        </h1>
        <p className="font-cormorant text-lg italic relative z-10 mb-7" style={{ color: 'rgba(237,237,239,0.5)' }}>
          Welcome to our community
        </p>
        <div className="relative z-10">
          <InstallButton />
        </div>
      </header>

      {/* Verse of the Day */}
      <section className="px-5 mb-5" aria-label="Verse of the Day">
        <div className="verse-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} style={{ color: 'rgba(212,175,55,0.7)' }} aria-hidden="true" />
            <p className="text-[10px] font-semibold tracking-[2px] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
              Verse of the Day
            </p>
          </div>
          <blockquote className="font-cormorant text-xl italic leading-relaxed" style={{ color: '#EDEDEF' }}>
            &ldquo;{verseOfDay}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-5 mb-5" aria-label="Quick access">
        <p className="font-cinzel text-[10px] tracking-[3px] uppercase mb-4" style={{ color: 'rgba(237,237,239,0.28)' }}>
          Explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ href, icon: Icon, label, desc, glow, border, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="block p-4 rounded-2xl transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:outline-none"
              style={{ background: glow, border: `1px solid ${border}`, boxShadow: `0 0 20px ${glow}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}` }}
              >
                <Icon size={18} style={{ color: iconColor }} aria-hidden="true" />
              </div>
              <p className="font-semibold text-sm mb-0.5" style={{ color: '#EDEDEF' }}>{label}</p>
              <p className="text-[11px]" style={{ color: 'rgba(138,143,152,0.9)' }}>{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      {announcements.length > 0 && (
        <section className="px-5 mb-5" aria-label="Upcoming events">
          <div className="flex items-center justify-between mb-4">
            <p className="font-cinzel text-[10px] tracking-[3px] uppercase" style={{ color: 'rgba(237,237,239,0.28)' }}>
              Upcoming Events
            </p>
            <Link
              href="/announcements"
              className="flex items-center gap-1 text-[11px] rounded focus-visible:ring-2 focus-visible:outline-none px-1"
              style={{ color: 'rgba(212,175,55,0.65)' }}
            >
              See all <ChevronRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map(a => <AnnouncementCard key={a.id} announcement={a} />)}
          </div>
        </section>
      )}

      {/* Give & Support */}
      <section className="px-5 mb-5" aria-label="Give and support">
        <Link
          href="/giving"
          className="block p-6 rounded-2xl text-center focus-visible:ring-2 focus-visible:outline-none relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(124,58,237,0.07) 100%)',
            border: '1px solid rgba(212,175,55,0.22)',
            boxShadow: '0 0 40px rgba(212,175,55,0.06)',
          }}
        >
          <span
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)' }}
            aria-hidden="true"
          />
          <p className="gold-text font-cinzel text-lg font-bold mb-1 tracking-wide">Give &amp; Support</p>
          <p className="text-sm" style={{ color: 'rgba(138,143,152,0.9)' }}>
            Sow into the Kingdom — every gift makes a difference
          </p>
        </Link>
      </section>
    </main>
  );
}
