'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { InstallButton } from '@/components/InstallButton';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Announcement, AppSettings } from '@/types';
import { Calendar, BookOpen, Heart, ChevronRight, Cross } from 'lucide-react';
import Link from 'next/link';

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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="home-bg flex items-center justify-center min-h-screen">
      <div className="loading-spinner" />
    </div>
  );

  const quickLinks = [
    { href: '/pastors-corner', icon: BookOpen,  label: "Pastor's Corner",  desc: 'Messages & devotions',       bg: 'rgba(45,27,105,0.6)',  border: 'rgba(212,175,55,0.25)' },
    { href: '/youth',          icon: Heart,     label: 'Youth',             desc: 'Connect & grow',             bg: 'rgba(124,58,237,0.2)', border: 'rgba(0,255,136,0.2)'   },
    { href: '/sunday-school',  icon: Calendar,  label: 'Sunday School',     desc: 'Learn & explore',            bg: 'rgba(249,115,22,0.15)',border: 'rgba(249,115,22,0.3)'  },
    { href: '/announcements',  icon: ChevronRight, label: 'All Events',     desc: 'Upcoming & recent',          bg: 'rgba(167,139,250,0.1)',border: 'rgba(167,139,250,0.2)' },
  ];

  return (
    <div className="home-bg page-transition pb-24">
      {/* Hero */}
      <div className="home-hero-glow relative px-6 pt-14 pb-8 text-center overflow-hidden">
        {/* Background stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Cross icon */}
        <div className="relative z-10 flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(212,175,55,0.35)' }}>
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
              <rect x="11" y="0" width="6" height="36" rx="3" fill="#D4AF37"/>
              <rect x="0" y="10" width="28" height="6" rx="3" fill="#D4AF37"/>
            </svg>
          </div>
        </div>

        <h1 className="font-cinzel text-2xl font-bold gold-text relative z-10 leading-tight mb-1">
          Christ Restoration Centre
        </h1>
        <p className="font-cormorant text-base italic relative z-10 mb-6"
          style={{ color: 'rgba(196,181,253,0.8)' }}>
          Welcome to our community
        </p>
        <div className="relative z-10">
          <InstallButton />
        </div>
      </div>

      {/* Verse of the Day */}
      <div className="px-5 mb-5">
        <div className="verse-card">
          <p className="text-[10px] font-semibold tracking-[2px] uppercase mb-3"
            style={{ color: 'rgba(212,175,55,0.7)' }}>
            ✦ Verse of the Day
          </p>
          <p className="font-cormorant text-lg italic leading-relaxed"
            style={{ color: '#F5F0FF' }}>
            "{verseOfDay}"
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-5 mb-5">
        <p className="font-cinzel text-xs tracking-[2px] uppercase mb-3"
          style={{ color: 'rgba(167,139,250,0.6)' }}>
          Explore
        </p>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div className="p-4 rounded-[16px] h-full transition-all duration-200 active:scale-95"
                  style={{ background: link.bg, border: `1px solid ${link.border}` }}>
                  <Icon size={20} className="mb-2" style={{ color: '#D4AF37' }} />
                  <p className="font-semibold text-sm mb-0.5" style={{ color: '#F5F0FF' }}>
                    {link.label}
                  </p>
                  <p className="text-[11px]" style={{ color: 'rgba(196,181,253,0.6)' }}>
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-cinzel text-xs tracking-[2px] uppercase"
              style={{ color: 'rgba(167,139,250,0.6)' }}>
              Upcoming Events
            </p>
            <Link href="/announcements">
              <span className="text-[11px] flex items-center gap-1"
                style={{ color: 'rgba(212,175,55,0.7)' }}>
                See all <ChevronRight size={12} />
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        </div>
      )}

      {/* Give section */}
      <div className="px-5 mb-5">
        <Link href="/giving">
          <div className="p-5 rounded-[16px] text-center transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(124,58,237,0.1))', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="gold-text font-cinzel text-base font-bold mb-1">Give & Support</p>
            <p className="text-[12px]" style={{ color: 'rgba(196,181,253,0.7)' }}>
              Sow into the Kingdom — every gift makes a difference
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
