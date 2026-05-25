// src/app/youth/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { Announcement, GalleryItem, VerseOfWeek } from '@/types';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Megaphone, Image as ImageIcon, BookHeart } from 'lucide-react';

export default function Youth() {
  const { setTheme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [verseOfWeek, setVerseOfWeek] = useState<VerseOfWeek | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('youth');
    fetchData();
  }, [setTheme]);

  const fetchData = async () => {
    try {
      // Fetch youth announcements
      const announcementsQuery = query(
        collection(db, 'youthAnnouncements'),
        orderBy('date', 'desc'),
        limit(10)
      );
      const announcementsSnap = await getDocs(announcementsQuery);
      const announcementsData = announcementsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Announcement[];
      setAnnouncements(announcementsData);

      // Fetch youth gallery
      const galleryQuery = query(
        collection(db, 'galleryItems'),
        where('tag', '==', 'youth'),
        orderBy('uploadedAt', 'desc'),
        limit(12)
      );
      const gallerySnap = await getDocs(galleryQuery);
      const galleryData = gallerySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      })) as GalleryItem[];
      setGallery(galleryData);

      // Fetch verse of week
      const verseDoc = await getDoc(doc(db, 'youthVerseOfWeek', 'current'));
      if (verseDoc.exists()) {
        setVerseOfWeek(verseDoc.data() as VerseOfWeek);
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
    <div className="page-transition min-h-screen p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          Youth Corner
        </h1>

        {/* Verse of the Week */}
        {verseOfWeek && (
          <div className="glass-card p-6 rounded-xl shadow-2xl mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookHeart size={24} style={{ color: 'var(--accent-color)' }} />
              <h2 className="text-xl font-bold">Verse of the Week</h2>
            </div>
            <p className="text-lg mb-2">&ldquo;{verseOfWeek.verse}&rdquo;</p>
            <p className="text-sm opacity-75" style={{ color: 'var(--accent-color)' }}>
              - {verseOfWeek.reference}
            </p>
          </div>
        )}

        {/* Announcements */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={24} style={{ color: 'var(--accent-color)' }} />
            <h2 className="text-2xl font-bold">Youth Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <p className="text-center opacity-75 glass-card p-6 rounded-lg">
                No announcements at this time.
              </p>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon size={24} style={{ color: 'var(--accent-color)' }} />
            <h2 className="text-2xl font-bold">Youth Gallery</h2>
          </div>
          {gallery.length > 0 ? (
            <GalleryGrid items={gallery} />
          ) : (
            <p className="text-center opacity-75 glass-card p-6 rounded-lg">
              No gallery items yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
