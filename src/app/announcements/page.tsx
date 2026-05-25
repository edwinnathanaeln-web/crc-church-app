// src/app/announcements/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { Announcement } from '@/types';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Filter } from 'lucide-react';

export default function Announcements() {
  const { setTheme } = useTheme();
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<'all' | 'general' | 'youth' | 'sundaySchool'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('home');
    fetchAnnouncements();
  }, [setTheme]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAnnouncements(allAnnouncements);
    } else {
      setFilteredAnnouncements(
        allAnnouncements.filter(a => a.category === filter)
      );
    }
  }, [filter, allAnnouncements]);

  const fetchAnnouncements = async () => {
    try {
      const collections = [
        { name: 'globalAnnouncements', category: 'general' as const },
        { name: 'youthAnnouncements', category: 'youth' as const },
        { name: 'sundaySchoolAnnouncements', category: 'sundaySchool' as const },
      ];

      const allData: Announcement[] = [];

      for (const col of collections) {
        const q = query(collection(db, col.name), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          category: col.category,
          date: doc.data().date?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Announcement[];
        allData.push(...data);
      }

      // Sort all by date
      allData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setAllAnnouncements(allData);
      setFilteredAnnouncements(allData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          All Announcements
        </h1>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter size={20} style={{ color: 'var(--accent-color)' }} />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              filter === 'all' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: filter === 'all' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: filter === 'all' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('general')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              filter === 'general' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: filter === 'general' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: filter === 'general' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            General
          </button>
          <button
            onClick={() => setFilter('youth')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              filter === 'youth' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: filter === 'youth' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: filter === 'youth' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            Youth
          </button>
          <button
            onClick={() => setFilter('sundaySchool')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              filter === 'sundaySchool' ? 'shadow-lg' : 'opacity-60'
            }`}
            style={{
              backgroundColor: filter === 'sundaySchool' ? 'var(--accent-color)' : 'rgba(212, 175, 55, 0.2)',
              color: filter === 'sundaySchool' ? 'var(--bg-color)' : 'var(--text-color)',
            }}
          >
            Sunday School
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <p className="text-center opacity-75 p-6">No announcements in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
