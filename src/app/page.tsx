// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LogoText } from '@/components/Logo';
import { InstallButton } from '@/components/InstallButton';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { useTheme } from '@/contexts/ThemeContext';
import { Announcement, DailyMessage, AppSettings } from '@/types';
import { Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Home() {
  const { setTheme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [todayMessage, setTodayMessage] = useState<DailyMessage | null>(null);
  const [verseOfDay, setVerseOfDay] = useState<string>('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('home');
    fetchData();
  }, [setTheme]);

  const fetchData = async () => {
    try {
      // Fetch upcoming announcements
      const announcementsQuery = query(
        collection(db, 'globalAnnouncements'),
        orderBy('date', 'desc'),
        limit(5)
      );
      const announcementsSnap = await getDocs(announcementsQuery);
      const announcementsData = announcementsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Announcement[];
      setAnnouncements(announcementsData);

      // Fetch today's daily message
      const messagesQuery = query(
        collection(db, 'dailyMessages'),
        orderBy('date', 'desc'),
        limit(1)
      );
      const messagesSnap = await getDocs(messagesQuery);
      if (!messagesSnap.empty) {
        const messageData = messagesSnap.docs[0].data();
        setTodayMessage({
          id: messagesSnap.docs[0].id,
          ...messageData,
          date: messageData.date?.toDate(),
          createdAt: messageData.createdAt?.toDate(),
        } as DailyMessage);
      }

      // Fetch verse of the day
      const settingsDoc = await getDoc(doc(db, 'appSettings', 'main'));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data() as AppSettings;
        if (settings.verseOfTheDay) {
          setVerseOfDay(settings.verseOfTheDay);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <LogoText />
        </div>
        <p className="text-lg opacity-90 mb-6">Welcome to our community</p>
        <InstallButton />
      </div>

      {/* Verse of the Day */}
      <div
        className="p-6 rounded-lg shadow-lg mb-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          borderLeft: '4px solid var(--accent-color)',
        }}
      >
        <h2 className="text-sm font-semibold mb-2 opacity-75">VERSE OF THE DAY</h2>
        <p className="text-lg italic font-playfair">{verseOfDay}</p>
      </div>

      {/* Today's Pastor's Corner */}
      {todayMessage && (
        <Link href="/pastors-corner">
          <div className="p-4 rounded-lg shadow-lg mb-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer"
               style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={20} style={{ color: 'var(--accent-color)' }} />
              <h2 className="font-semibold">Today's Message</h2>
            </div>
            <p className="text-sm opacity-90">{todayMessage.title}</p>
            <p className="text-xs opacity-75 mt-1">{format(todayMessage.date, 'MMM dd, yyyy')}</p>
          </div>
        </Link>
      )}

      {/* Upcoming Events/Announcements */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={24} style={{ color: 'var(--accent-color)' }} />
          <h2 className="text-xl font-bold">Upcoming Events</h2>
        </div>
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <p className="text-center opacity-75">No upcoming events at this time.</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/announcements">
          <div className="p-4 rounded-lg text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
               style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <Calendar size={32} className="mx-auto mb-2" style={{ color: 'var(--accent-color)' }} />
            <p className="font-semibold">All Events</p>
          </div>
        </Link>
        <Link href="/giving">
          <div className="p-4 rounded-lg text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
               style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <BookOpen size={32} className="mx-auto mb-2" style={{ color: 'var(--accent-color)' }} />
            <p className="font-semibold">Give</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
