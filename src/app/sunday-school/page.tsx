// src/app/sunday-school/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTheme } from '@/contexts/ThemeContext';
import { Announcement, GalleryItem, VerseOfWeek } from '@/types';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Megaphone, Image as ImageIcon, Star } from 'lucide-react';

export default function SundaySchool() {
  const { setTheme } = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [memoryVerse, setMemoryVerse] = useState<VerseOfWeek | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTheme('sundayschool');
    fetchData();
  }, [setTheme]);

  const fetchData = async () => {
    try {
      // Fetch Sunday School announcements
      const announcementsQuery = query(
        collection(db, 'sundaySchoolAnnouncements'),
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

      // Fetch Sunday School gallery
      const galleryQuery = query(
        collection(db, 'galleryItems'),
        where('tag', '==', 'sundaySchool'),
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

      // Fetch memory verse
      const verseDoc = await getDoc(doc(db, 'sundaySchoolMemoryVerse', 'current'));
      if (verseDoc.exists()) {
        setMemoryVerse(verseDoc.data() as VerseOfWeek);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center clouds-pattern">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen clouds-pattern p-6 font-nunito">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--accent-color)' }}>
          Sunday School Corner
        </h1>

        {/* Memory Verse */}
        {memoryVerse && (
          <div className="p-6 rounded-2xl shadow-xl mb-8"
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.9)',
                 border: `3px solid ${memoryVerse ? 'var(--accent-color)' : 'transparent'}`
               }}>
            <div className="flex items-center gap-2 mb-3">
              <Star size={24} style={{ color: 'var(--accent-color)' }} />
              <h2 className="text-xl font-bold">Memory Verse</h2>
            </div>
            <p className="text-lg mb-2 text-gray-800">&ldquo;{memoryVerse.verse}&rdquo;</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--accent-color)' }}>
              - {memoryVerse.reference}
            </p>
          </div>
        )}

        {/* Announcements */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={24} style={{ color: 'var(--accent-color)' }} />
            <h2 className="text-2xl font-bold">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))
            ) : (
              <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                <p className="opacity-75">No announcements at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon size={24} style={{ color: 'var(--accent-color)' }} />
            <h2 className="text-2xl font-bold">Sunday School Gallery</h2>
          </div>
          {gallery.length > 0 ? (
            <GalleryGrid items={gallery} />
          ) : (
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <p className="opacity-75">No gallery items yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
